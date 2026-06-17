// Funktionen für Fehlerbehandlung und Weiterleitungen importieren
import { fail, redirect } from '@sveltejs/kit';
// Datenbankverbindung importieren
import pool from '$lib/server/database.js';
// Funktionen für Passwortprüfung und Session-Erstellung importieren
import { verifyPassword, createSession } from '$lib/server/auth.js';
// Alle Formulare (Actions) dieser Seite
export const actions = {
    
	/**
	 * Login eines Benutzers
	 */
	login: async ({ request, cookies }) => {

		// Formulardaten auslesen
		const form = await request.formData();

		// Benutzername aus dem Formular holen
		const username = form.get('username');

		// Passwort aus dem Formular holen
		const password = form.get('password');

		// Prüfen ob alle Felder ausgefüllt wurden
		if (!username || !password) {
			return fail(400, {
				error: 'Bitte alle Felder ausfüllen.'
			});
		}

		// Benutzer anhand des Usernamens suchen
		const [rows] = await pool.execute(
			'SELECT * FROM users WHERE username = ?',
			[username]
		);

		// Fehlermeldung wenn Benutzer nicht gefunden wurde
		if (rows.length === 0) {
			return fail(400, {
				error: 'Username nicht gefunden.'
			});
		}

		// Passwort mit dem gespeicherten Hash vergleichen
		if (!(await verifyPassword(password, rows[0].password_hash))) {
			return fail(400, {
				error: 'Falsches Passwort.'
			});
		}

		// Neue Session erstellen
		const sessionId = await createSession(rows[0].id);

		// Session-ID als Cookie speichern
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30
		});

		// Nach erfolgreichem Login zur Startseite weiterleiten
		throw redirect(303, '/');
	}
};