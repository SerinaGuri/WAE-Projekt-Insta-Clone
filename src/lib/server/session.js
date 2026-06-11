import crypto from 'crypto';
import pool from '$lib/server/database.js';

export function createSessionId() {
	return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId) {
	const sessionId = createSessionId();

	await pool.execute(
		'INSERT INTO sessions (id, user_id) VALUES (?, ?)',
		[sessionId, userId]
	);

	return sessionId;
}