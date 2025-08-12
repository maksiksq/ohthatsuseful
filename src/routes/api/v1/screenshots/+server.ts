import {error as sverror, fail, type RequestHandler} from '@sveltejs/kit';
import {SECRET_API_CONTROL_KEY} from "$env/static/private";

export const POST: RequestHandler = async ({request}) => {
    const authHeader = await request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        throw sverror(400, 'missing or invalid auth header');
    }

    const key = authHeader?.slice(7);

    if (key != SECRET_API_CONTROL_KEY) {
        console.log('not yipeeeeeeeee')
        throw sverror(401, 'wrong key, no tomatoes for you.');
    }

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    });
};