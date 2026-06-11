// Passwort-Hashing und Session-Verwaltung
import pool from './database.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

/**
 * Hash password before saving to DB
 */
export async function hashPassword(password) {
	return bcrypt.hash(password, 10);
}

/**
 * Compare login password with stored hash
 */
export async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

/**
 * Create a session (30 days valid)
 */
export async function createSession(userId) {
	const sessionId = randomUUID();

	const expiresAt = new Date(
		Date.now() + 30 * 24 * 60 * 60 * 1000
	);

	await pool.execute(
		'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
		[sessionId, userId, expiresAt]
	);

	return sessionId;
}

/**
 * Validate session and return user
 */
export async function validateSession(sessionId) {
	if (!sessionId) return null;

	const [rows] = await pool.execute(
		`SELECT u.id, u.username
		 FROM sessions s
		 JOIN users u ON s.user_id = u.id
		 WHERE s.id = ? AND s.expires_at > NOW()`,
		[sessionId]
	);

	return rows[0] ?? null;
}

/**
 * Delete session (logout)
 */
export async function invalidateSession(sessionId) {
	if (!sessionId) return;

	await pool.execute(
		'DELETE FROM sessions WHERE id = ?',
		[sessionId]
	);
}