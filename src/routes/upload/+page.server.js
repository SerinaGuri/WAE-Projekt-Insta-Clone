import pool from '$lib/server/database.js';
import { put, del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
console.log('TOKEN VALUE:', BLOB_READ_WRITE_TOKEN);

export async function load() {
	const [images] = await pool.execute(
		`SELECT images.*, users.username
		 FROM images
		 JOIN users ON images.author_id = users.id
		 ORDER BY images.id DESC`
	);

	return {
		images
	};
}

export const actions = {
	add: async ({ request, cookies }) => {
		const formData = await request.formData();

		const uploadedImage = formData.get('image');
		const description = formData.get('description');

		if (!(uploadedImage instanceof File)) {
			return { success: false };
		}

		// upload to blob
		const uploadedBlob = await put(
			uploadedImage.name,
			uploadedImage,
			{ access: 'public', token: BLOB_READ_WRITE_TOKEN}
		);

		// 🔥 FIX: get a real user instead of hardcoding 1
		const sessionId = cookies.get('session');

	if (!sessionId) {
		throw redirect(303, '/login');
	}

	const [sessions] = await pool.execute('SELECT user_id FROM sessions WHERE id = ?',[sessionId]);

	if (!sessions.length) {
		throw redirect(303, '/login');
	}

	const userId = sessions[0].user_id;

		// save image
		await pool.execute(`INSERT INTO images (image, description, author_id, votes) VALUES (?, ?, ?, ?)`,
			[
				uploadedBlob.url,
				description,
				userId,
				0
			]
		);

		throw redirect(303, '/');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		const url = formData.get('url');

		await del(url);

		await pool.execute(
			'DELETE FROM images WHERE id = ?',
			[id]
		);

		return { success: true };
	}
};