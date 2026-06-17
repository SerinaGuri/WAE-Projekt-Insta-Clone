// profile/[id]/+page.server.js

// Funktion für Fehlerseiten importieren
import { error } from '@sveltejs/kit';

// Datenbankverbindung importieren
import pool from '$lib/server/database.js';

/**
 * Lädt alle Daten für die Profilseite eines Benutzers.
 */
export async function load({ params }) {

	// Benutzer anhand der ID aus der URL laden
	const [users] = await pool.execute(
		'SELECT id, username FROM users WHERE id = ?',
		[params.id]
	);

	// Fehler ausgeben, falls der Benutzer nicht existiert
	if (!users.length) {
		throw error(404, 'User not found');
	}

	// Ersten gefundenen Benutzer speichern
	const user = users[0];

	// Alle Bilder des Benutzers laden
	const [images] = await pool.execute(
		`
		SELECT
			id,
			image,
			description,
			votes,
			created_at
		FROM images
		WHERE author_id = ?
		ORDER BY created_at DESC
		`,
		[params.id]
	);

	// Daten an die Svelte-Seite zurückgeben
	return {
		user,
		images
	};
}