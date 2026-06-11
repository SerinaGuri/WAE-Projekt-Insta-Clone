import { validateSession } from '$lib/server/auth.js';

export async function load({ cookies }) {
	const sessionId = cookies.get('session');

	const user = await validateSession(sessionId);

	return {
		user
	};
}