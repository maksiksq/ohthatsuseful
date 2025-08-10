import {error as sverror, type RequestHandler} from '@sveltejs/kit';

export const GET: RequestHandler = async ({url}) => {


    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    });
};