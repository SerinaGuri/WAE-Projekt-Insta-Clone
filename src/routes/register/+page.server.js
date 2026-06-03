import pool from '$lib/server/database.js';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const username = form.get('username');
		const password = form.get('password');

		if (!username || !password) {
			return { error: 'Missing fields' };
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await pool.execute(
			'INSERT INTO users (username, password_hash) VALUES (?, ?)',
			[username, passwordHash]
		);

		return { success: true };
	}
};