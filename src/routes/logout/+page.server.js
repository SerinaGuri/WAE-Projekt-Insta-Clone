//Session löschen und zur Startseite weiterleiten
import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth.js';

export const actions = {
    default: async ({ cookies }) => {
        const sessionId = cookies.get('session');

        if (sessionId) {
            // Session aus der Datenbank löschen
            await invalidateSession(sessionId);
            // Cookie löschen
            cookies.delete('session', { path: '/' });
        }

        throw redirect(303, '/');
    }
};