// Verbindung zur Datenbank
import pool from './database.js';

// Wird zum sicheren Verschlüsseln von Passwörtern verwendet
import bcrypt from 'bcrypt';

// Erzeugt eindeutige IDs für Sessions
import { randomUUID } from 'crypto';

/**
 * Erstellt aus dem Passwort einen Hash.
 * Das eigentliche Passwort wird nie in der Datenbank gespeichert.
 */
export async function hashPassword(password) {
	return bcrypt.hash(password, 10);
}

/**
 * Vergleicht das eingegebene Passwort mit dem
 * gespeicherten Passwort-Hash.
 */
export async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

/**
 * Erstellt eine neue Session für einen Benutzer.
 * Die Session bleibt 30 Tage gültig.
 */
export async function createSession(userId) {
	// Eindeutige Session-ID erzeugen
	const sessionId = randomUUID();

	// Ablaufdatum der Session berechnen
	const expiresAt = new Date(
		Date.now() + 30 * 24 * 60 * 60 * 1000
	);

	// Session in der Datenbank speichern
	await pool.execute(
		'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
		[sessionId, userId, expiresAt]
	);

	return sessionId;
}

/**
 * Überprüft, ob eine Session vorhanden und noch gültig ist.
 * Falls ja, werden die Benutzerdaten zurückgegeben.
 */
export async function validateSession(sessionId) {
	if (!sessionId) return null;

	const [rows] = await pool.execute(
		`
		SELECT u.id, u.username, u.is_admin
		FROM sessions s
		JOIN users u ON s.user_id = u.id
		WHERE s.id = ? AND s.expires_at > NOW()
		`,
		[sessionId]
	);

	return rows[0] ?? null;
}

/**
 * Löscht die Session aus der Datenbank.
 * Dadurch wird der Benutzer ausgeloggt.
 */
export async function invalidateSession(sessionId) {
	if (!sessionId) return;

	await pool.execute(
		'DELETE FROM sessions WHERE id = ?',
		[sessionId]
	);
}