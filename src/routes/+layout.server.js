// Importiert die Funktion zur Überprüfung einer Session.
// Damit kann festgestellt werden, ob ein Benutzer eingeloggt ist.
import { validateSession } from '$lib/server/auth.js';

// Die load-Funktion wird beim Laden der Seite ausgeführt.
// Sie liefert Daten an die Svelte-Komponente zurück.
export async function load({ cookies }) {

	// Liest die Session-ID aus den Cookies des Browsers aus.
	// Die Session-ID wurde beim Login gespeichert.
	const sessionId = cookies.get('session');

	// Überprüft anhand der Session-ID, ob ein gültiger Benutzer existiert.
	// Falls die Session ungültig ist, wird null zurückgegeben.
	const user = await validateSession(sessionId);

	// Übergibt die Benutzerdaten an die Seite.
	// Diese können anschließend mit data.user verwendet werden.
	return {
		user
	};
}