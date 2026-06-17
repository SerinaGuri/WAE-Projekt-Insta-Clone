// Funktionen für Fehlerbehandlung und Weiterleitungen
import { error, redirect } from '@sveltejs/kit';

// Datenbankverbindung
import pool from '$lib/server/database.js';

/**
 * Lädt alle Daten für die Bild-Detailseite.
 * Es werden das Bild, die Kommentare und der Like-Status geladen.
 */
export async function load({ params, cookies, url }) {
	// Bild inklusive Benutzername laden
	const [rows] = await pool.execute(
		`
		SELECT
			images.*,
			users.username
		FROM images
		JOIN users ON images.author_id = users.id
		WHERE images.id = ?
		`,
		[params.id]
	);

	if (!rows.length) {
		throw error(404, 'Image not found');
	}

	// Alle Kommentare zum Bild laden
	const [comments] = await pool.execute(
		`
		SELECT
			comments.*,
			users.username
		FROM comments
		JOIN users ON comments.user_id = users.id
		WHERE comments.image_id = ?
		ORDER BY comments.created_at DESC
		`,
		[params.id]
	);

	// Standardwerte setzen
	let liked = false;
	let user = null;

	// Session aus den Cookies lesen
	const sessionId = cookies.get('session');

	if (sessionId) {
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (sessions.length) {
			const userId = sessions[0].user_id;

			// Benutzerdaten laden
			const [users] = await pool.execute(
				'SELECT id, username, is_admin FROM users WHERE id = ?',
				[userId]
			);

			if (users.length) {
				user = users[0];
			}

			// Prüfen ob das Bild bereits geliked wurde
			const [votes] = await pool.execute(
				'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
				[userId, params.id]
			);

			liked = votes.length > 0;
		}
	}

	// Daten an die Svelte-Seite zurückgeben
	return {
		image: rows[0],
		liked,
		comments,
		user,
		fromProfile: url.searchParams.get('from') === 'profile',
		profileUserId: url.searchParams.get('user')
	};
}

/**
 * Aktionen für Likes, Kommentare und Löschvorgänge.
 */
export const actions = {
	/**
	 * Like hinzufügen oder entfernen.
	 * Eigene Bilder können nicht geliked werden.
	 */
	toggleLike: async ({ params, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;
		const imageId = params.id;

		// Besitzer des Bildes laden
		const [images] = await pool.execute(
			'SELECT author_id FROM images WHERE id = ?',
			[imageId]
		);

		if (!images.length) {
			throw error(404, 'Image not found');
		}

		const imageOwnerId = images[0].author_id;

		// Eigene Bilder dürfen nicht geliked werden
		if (imageOwnerId === userId) {
			return {
				success: false
			};
		}

		// Prüfen ob bereits ein Like existiert
		const [existing] = await pool.execute(
			'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
			[userId, imageId]
		);

		// Like entfernen
		if (existing.length) {
			await pool.execute(
				'DELETE FROM votes WHERE user_id = ? AND image_id = ?',
				[userId, imageId]
			);

			await pool.execute(
				'UPDATE images SET votes = votes - 1 WHERE id = ?',
				[imageId]
			);

			return {
				liked: false
			};
		}

		// Neuen Like speichern
		await pool.execute(
			'INSERT INTO votes (user_id, image_id) VALUES (?, ?)',
			[userId, imageId]
		);

		await pool.execute(
			'UPDATE images SET votes = votes + 1 WHERE id = ?',
			[imageId]
		);

		return {
			liked: true
		};
	},

	/**
	 * Speichert einen neuen Kommentar zum Bild.
	 */
	comment: async ({ request, params, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;

		const formData = await request.formData();
		const text = formData.get('text');

		if (!text || !text.trim()) {
			return {
				success: false
			};
		}

		// Kommentar in der Datenbank speichern
		await pool.execute(
			`
			INSERT INTO comments (image_id, user_id, text)
			VALUES (?, ?, ?)
			`,
			[params.id, userId, text]
		);

		return {
			success: true
		};
	},

	/**
	 * Löscht ein Bild.
	 * Erlaubt für den Besitzer des Bildes oder einen Administrator.
	 */
	deleteImage: async ({ params, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;

		const [users] = await pool.execute(
			'SELECT is_admin FROM users WHERE id = ?',
			[userId]
		);

		const [images] = await pool.execute(
			'SELECT author_id FROM images WHERE id = ?',
			[params.id]
		);

		if (!images.length) {
			throw error(404, 'Image not found');
		}

		// Prüfen ob Benutzer Besitzer oder Administrator ist
		const isOwner = images[0].author_id === userId;

		if (!users.length || (!users[0].is_admin && !isOwner)) {
			throw error(403, 'Forbidden');
		}

		// Bild aus der Datenbank löschen
		await pool.execute(
			'DELETE FROM images WHERE id = ?',
			[params.id]
		);

		throw redirect(303, '/');
	},

	/**
	 * Löscht einen Kommentar.
	 * Aktuell nur für Administratoren erlaubt.
	 */
	deleteComment: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;

		const [users] = await pool.execute(
			'SELECT is_admin FROM users WHERE id = ?',
			[userId]
		);

		if (!users.length || !users[0].is_admin) {
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const commentId = formData.get('commentId');

		// Kommentar aus der Datenbank löschen
		await pool.execute(
			'DELETE FROM comments WHERE id = ?',
			[commentId]
		);

		return {
			success: true
		};
	}
};