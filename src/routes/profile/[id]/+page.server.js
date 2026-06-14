import { error } from '@sveltejs/kit';
import pool from '$lib/server/database.js';

export async function load({ params }) {
	const [users] = await pool.execute(
		'SELECT id, username FROM users WHERE id = ?',
		[params.id]
	);

	if (!users.length) {
		throw error(404, 'User not found');
	}

	const user = users[0];

	const [images] = await pool.execute(
		`
		SELECT
			id,
			image,
			description,
			votes,
			created_at
		FROM images
		WHERE author_id = ?
		ORDER BY created_at DESC
		`,
		[params.id]
	);

	return {
		user,
		images
	};
}