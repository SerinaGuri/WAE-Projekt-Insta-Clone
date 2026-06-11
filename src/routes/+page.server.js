import { pool } from '$lib/server/db.js';

export async function load() {
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

	return {
		images
	};
}