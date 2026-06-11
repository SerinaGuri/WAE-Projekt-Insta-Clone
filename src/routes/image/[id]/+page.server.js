import { error, redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';

export async function load({ params, cookies }) {
	const [rows] = await pool.execute(
		`
		SELECT
			images.*,
			users.username
		FROM images
		JOIN users ON images.author_id = users.id
		WHERE images.id = ?
		`,
		[params.id]
	);

	if (!rows.length) {
		throw error(404, 'Image not found');
	}

	const [comments] = await pool.execute(
		`
		SELECT
			comments.*,
			users.username
		FROM comments
		JOIN users ON comments.user_id = users.id
		WHERE comments.image_id = ?
		ORDER BY comments.created_at DESC
		`,
		[params.id]
	);

	let liked = false;

	const sessionId = cookies.get('session');

	if (sessionId) {
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (sessions.length) {
			const userId = sessions[0].user_id;

			const [votes] = await pool.execute(
				'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
				[userId, params.id]
			);

			liked = votes.length > 0;
		}
	}

	return {
		image: rows[0],
		liked,
		comments
	};
}

export const actions = {
	toggleLike: async ({ params, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;
		const imageId = params.id;

		const [existing] = await pool.execute(
			'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
			[userId, imageId]
		);

		// Unlike
		if (existing.length) {
			await pool.execute(
				'DELETE FROM votes WHERE user_id = ? AND image_id = ?',
				[userId, imageId]
			);

			await pool.execute(
				'UPDATE images SET votes = votes - 1 WHERE id = ?',
				[imageId]
			);

			return {
				liked: false
			};
		}

		// Like
		await pool.execute(
			'INSERT INTO votes (user_id, image_id) VALUES (?, ?)',
			[userId, imageId]
		);

		await pool.execute(
			'UPDATE images SET votes = votes + 1 WHERE id = ?',
			[imageId]
		);

		return {
			liked: true
		};
	},

	comment: async ({ request, params, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;

		const formData = await request.formData();
		const text = formData.get('text');

		if (!text || !text.trim()) {
			return {
				success: false
			};
		}

		await pool.execute(
			`
			INSERT INTO comments (image_id, user_id, text)
			VALUES (?, ?, ?)
			`,
			[params.id, userId, text]
		);

		return {
			success: true
		};
	}
};