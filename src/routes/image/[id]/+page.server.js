import { error, redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';

export async function load({ params, cookies, url }) {
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
	let user = null;

	const sessionId = cookies.get('session');

	if (sessionId) {
		const [sessions] = await pool.execute(
			'SELECT user_id FROM sessions WHERE id = ?',
			[sessionId]
		);

		if (sessions.length) {
			const userId = sessions[0].user_id;

			const [users] = await pool.execute(
				'SELECT id, username, is_admin FROM users WHERE id = ?',
				[userId]
			);

			if (users.length) {
				user = users[0];
			}

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
		comments,
		user,
		fromProfile: url.searchParams.get('from') === 'profile',
		profileUserId: url.searchParams.get('user')
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

		const [images] = await pool.execute(
			'SELECT author_id FROM images WHERE id = ?',
			[imageId]
		);

		if (!images.length) {
			throw error(404, 'Image not found');
		}

		const imageOwnerId = images[0].author_id;

		if (imageOwnerId === userId) {
			return {
				success: false
			};
		}

		const [existing] = await pool.execute(
			'SELECT id FROM votes WHERE user_id = ? AND image_id = ?',
			[userId, imageId]
		);

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
	},

	deleteImage: async ({ params, cookies }) => {
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

		const [users] = await pool.execute(
			'SELECT is_admin FROM users WHERE id = ?',
			[userId]
		);

		const [images] = await pool.execute('SELECT author_id FROM images WHERE id = ?',[params.id]);
		if (!images.length) {throw error(404, 'Image not found');	
		}

		const isOwner = images[0].author_id === userId;
		if (!users.length || (!users[0].is_admin && !isOwner)) {throw error(403, 'Forbidden');
		}

		await pool.execute(
			'DELETE FROM images WHERE id = ?',
			[params.id]
		);

		throw redirect(303, '/');
	},

	deleteComment: async ({ request, cookies }) => {
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

		const [users] = await pool.execute(
			'SELECT is_admin FROM users WHERE id = ?',
			[userId]
		);

		if (!users.length || !users[0].is_admin) {
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const commentId = formData.get('commentId');

		await pool.execute(
			'DELETE FROM comments WHERE id = ?',
			[commentId]
		);

		return {
			success: true
		};
	}
};