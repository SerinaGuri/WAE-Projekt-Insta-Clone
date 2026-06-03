import pool from '$lib/server/database';

export async function load() {
	const [images] = await pool.query(`
		SELECT images.*, users.username
		FROM images
		JOIN users ON images.author_id = users.id
		ORDER BY images.id DESC
		LIMIT 25
	`);

	return {
		images
	};
}