import { redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';

export async function load({ cookies }) {
	const [images] = await pool.execute(`
		SELECT
			images.id,
			images.image,
			images.description,
			images.votes,
			users.username
		FROM images
		JOIN users ON images.author_id = users.id
		ORDER BY images.votes DESC
		LIMIT 25
	`);

	let likedImages = [];

	const sessionId = cookies.get('session');

	if (sessionId) {
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (sessions.length) {
			const userId = sessions[0].user_id;

			const [likes] = await pool.execute(
				'SELECT image_id FROM votes WHERE user_id = ?',
				[userId]
			);

			likedImages = likes.map((like) => like.image_id);
		}
	}

	return {
		images,
		likedImages
	};
}

export const actions = {
	upvote: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const imageId = formData.get('imageId');

		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (!sessions.length) {
			throw redirect(303, '/login');
		}

		const userId = sessions[0].user_id;

		const [existing] = await pool.execute(
			'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
			[userId, imageId]
		);

		if (existing.length) {
			return {
				success: false
			};
		}

		await pool.execute(
			'INSERT INTO votes (user_id, image_id) VALUES (?, ?)',
			[userId, imageId]
		);

		await pool.execute(
			'UPDATE images SET votes = votes + 1 WHERE id = ?',
			[imageId]
		);

		return {
			success: true
		};
	}
};