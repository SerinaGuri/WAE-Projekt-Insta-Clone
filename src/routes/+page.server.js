// Importiert redirect, um Benutzer bei Bedarf zur Login-Seite weiterzuleiten
import { redirect } from '@sveltejs/kit';

// Importiert die Datenbankverbindung
import pool from '$lib/server/database.js';

export async function load({ cookies }) {

	// Lädt die 25 Bilder mit den meisten Votes für die Startseite
	const [images] = await pool.execute(`
		SELECT
			images.id,
			images.image,
			images.description,
			images.votes,
			users.username
		FROM images
		JOIN users ON images.author_id = users.id
		ORDER BY images.votes DESC
		LIMIT 25
	`);

	// Speichert die Bilder, die der aktuelle Benutzer bereits geliked hat
	let likedImages = [];

	// Session-ID aus den Cookies holen
	const sessionId = cookies.get('session');

	// Prüfen, ob der Benutzer eingeloggt ist
	if (sessionId) {

		// Zur Session gehörige User-ID suchen
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (sessions.length) {

			const userId = sessions[0].user_id;

			// Alle Likes dieses Benutzers laden
			const [likes] = await pool.execute(
				'SELECT image_id FROM votes WHERE user_id = ?',
				[userId]
			);

			// Nur die Bild-IDs speichern
			likedImages = likes.map((like) => like.image_id);
		}
	}

	// Daten an die Seite zurückgeben
	return {
		images,
		likedImages
	};
}

export const actions = {

	// Aktion zum Hochvoten eines Bildes
	upvote: async ({ request, cookies }) => {

		// Session prüfen
		const sessionId = cookies.get('session');

		// Nicht eingeloggte Benutzer werden zum Login weitergeleitet
		if (!sessionId) {
			throw redirect(303, '/login');
		}

		// Bild-ID aus dem Formular holen
		const formData = await request.formData();
		const imageId = formData.get('imageId');

		// User anhand der Session ermitteln
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;

		// Prüfen, ob der Benutzer dieses Bild bereits geliked hat
		const [existing] = await pool.execute(
			'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
			[userId, imageId]
		);

		// Doppeltes Voting verhindern
		if (existing.length) {
			return {
				success: false
			};
		}

		// Vote in der votes-Tabelle speichern
		await pool.execute(
			'INSERT INTO votes (user_id, image_id) VALUES (?, ?)',
			[userId, imageId]
		);

		// Vote-Zähler beim Bild erhöhen
		await pool.execute(
			'UPDATE images SET votes = votes + 1 WHERE id = ?',
			[imageId]
		);

		return {
			success: true
		};
	}
};