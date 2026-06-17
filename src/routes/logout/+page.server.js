// logout/+page.server.js

// Funktion für Weiterleitungen importieren
import { redirect } from '@sveltejs/kit';

// Funktion zum Löschen einer Session importieren
import { invalidateSession } from '$lib/server/auth.js';

// Aktionen dieser Seite
export const actions = {

	/**
	 * Standard-Action für den Logout
	 */
	default: async ({ cookies }) => {

		// Session-ID aus den Cookies auslesen
		const sessionId = cookies.get('session');

		// Prüfen ob eine Session vorhanden ist
		if (sessionId) {

			// Session aus der Datenbank löschen
			await invalidateSession(sessionId);

			// Session-Cookie im Browser löschen
			cookies.delete('session', {
				path: '/'
			});
		}

		// Nach dem Logout zur Startseite weiterleiten
		throw redirect(303, '/');
	}
};