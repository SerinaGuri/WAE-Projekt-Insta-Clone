import pool from '$lib/server/database';

export async function load() {
	const [users] = await pool.query('SELECT * FROM users');

	return {
		users
	};
}