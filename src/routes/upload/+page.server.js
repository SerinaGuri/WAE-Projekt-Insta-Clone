// Importiert die Datenbankverbindung, damit Daten aus MySQL gelesen und gespeichert werden können.
import pool from '$lib/server/database.js';

// Importiert die Funktionen von Vercel Blob zum Hochladen (put) und Löschen (del) von Bildern.
import { put, del } from '@vercel/blob';

// Liest den geheimen Blob-Token aus den Umgebungsvariablen aus.
// Dieser Token wird benötigt, um Bilder in den Blob-Speicher hochladen zu dürfen.
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

// Importiert die Redirect-Funktion von SvelteKit.
// Damit können Benutzer nach bestimmten Aktionen auf andere Seiten weitergeleitet werden.
import { redirect } from '@sveltejs/kit';

// Gibt den Token in der Konsole aus (nur zu Testzwecken).
console.log('TOKEN VALUE:', BLOB_READ_WRITE_TOKEN);

// Lädt alle Bilder aus der Datenbank und verbindet sie mit den Benutzerdaten,
// damit auf der Startseite sowohl das Bild als auch der Benutzername angezeigt werden können.
export async function load() {
	const [images] = await pool.execute(
		`SELECT images.*, users.username
		 FROM images
		 JOIN users ON images.author_id = users.id
		 ORDER BY images.id DESC`
	);

	return {
		images
	};
}

export const actions = {

	// Aktion zum Hochladen eines Bildes
	add: async ({ request, cookies }) => {

		// Formulardaten auslesen
		const formData = await request.formData();

		// Bilddatei und Beschreibung aus dem Formular holen
		const uploadedImage = formData.get('image');
		const description = formData.get('description');

		// Prüfen, ob wirklich eine Datei ausgewählt wurde
		if (!(uploadedImage instanceof File)) {
			return { success: false };
		}

		// Bild in Vercel Blob hochladen
		const uploadedBlob = await put(
			uploadedImage.name,
			uploadedImage,
			{
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			}
		);

		// Session-ID aus den Cookies auslesen
		const sessionId = cookies.get('session');

		// Falls der Benutzer nicht eingeloggt ist
		if (!sessionId) {
			throw redirect(303, '/login');
		}

		// Benutzer anhand der Session in der Datenbank suchen
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		// Falls keine gültige Session gefunden wurde
		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		// Benutzer-ID aus der Session übernehmen
		const userId = sessions[0].user_id;

		// Bildinformationen in der Datenbank speichern
		await pool.execute(
			`INSERT INTO images (image, description, author_id, votes)
			 VALUES (?, ?, ?, ?)`,
			[
				uploadedBlob.url,
				description,
				userId,
				0
			]
		);

		// Nach erfolgreichem Upload zur Startseite weiterleiten
		throw redirect(303, '/');
	},

	// Aktion zum Löschen eines Bildes
	delete: async ({ request }) => {

		// Formulardaten auslesen
		const formData = await request.formData();

		const id = formData.get('id');
		const url = formData.get('url');

		// Bild aus dem Vercel Blob Speicher löschen
		await del(url);

		// Bild aus der Datenbank löschen
		await pool.execute(
			'DELETE FROM images WHERE id = ?',
			[id]
		);

		return { success: true };
	}
};