// register/+page.server.js

// Funktionen für Fehlerbehandlung und Weiterleitungen importieren
import { fail, redirect } from '@sveltejs/kit';

// Datenbankverbindung importieren
import pool from '$lib/server/database.js';

// Funktionen für Passwort-Hashing und Session-Erstellung importieren
import { hashPassword, createSession } from '$lib/server/auth.js';

// Alle Actions dieser Seite
export const actions = {

	/**
	 * Registrierung eines neuen Benutzers
	 */
	register: async ({ request, cookies }) => {

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

		// Variable für das Ergebnis der Datenbankabfrage
		let result;

		try {

			// Neuen Benutzer in der Datenbank speichern
			[result] = await pool.execute(
				'INSERT INTO users (username, password_hash) VALUES (?, ?)',
				[
					username,

					// Passwort vor dem Speichern verschlüsseln
					await hashPassword(password)
				]
			);

		} catch (err) {

			// Fehler wenn der Benutzername bereits existiert
			if (err.code === 'ER_DUP_ENTRY') {
				return fail(400, {
					error: 'Username ist bereits vergeben.'
				});
			}

			// Allgemeine Fehlermeldung
			return fail(500, {
				error: 'Registrierung fehlgeschlagen. Bitte erneut versuchen.'
			});
		}

		// Neue Session für den Benutzer erstellen
		const sessionId = await createSession(result.insertId);

		// Session-ID als Cookie speichern
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30
		});

		// Nach erfolgreicher Registrierung zur Startseite weiterleiten
		throw redirect(303, '/');
	}
};