import pool from '$lib/server/database.js';
import { put, del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
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
	add: async ({ request }) => {
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
		const [users] = await pool.execute(
			'SELECT id FROM users LIMIT 1'
		);

		if (!users.length) {
			return {
				success: false,
				error: 'No users in database'
			};
		}

		const userId = users[0].id;

		// save image
		await pool.execute(
			`INSERT INTO images (image, description, author_id, votes)
			 VALUES (?, ?, ?, ?)`,
			[
				uploadedBlob.url,
				description,
				userId,
				0
			]
		);

		return { success: true };
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