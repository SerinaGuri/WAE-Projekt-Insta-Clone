import pool from '$lib/server/database.js';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		const username = form.get('username');
		const password = form.get('password');

		const [users] = await pool.execute(
			'SELECT * FROM users WHERE username = ?',
			[username]
		);

		if (!users.length) {
			return { error: 'User not found' };
		}

		const user = users[0];

		const valid = await bcrypt.compare(password, user.password_hash);

		if (!valid) {
			return { error: 'Wrong password' };
		}

		return {
			success: true,
			userId: user.id
		};
	}
};