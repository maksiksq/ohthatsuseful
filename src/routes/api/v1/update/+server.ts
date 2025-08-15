import {error as sverror, type RequestHandler} from '@sveltejs/kit';
import {SECRET_API_CONTROL_KEY} from "$env/static/private";
import {PUBLIC_DEV} from "$lib";
import {getSupabaseDataClient} from "$lib/utils/getSupabaseDataClient";
import {updatePuppeteerData} from "$lib/utils/func/updatePuppeteerData";

export const POST: RequestHandler = async ({request}) => {
    // auth
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        throw sverror(400, 'missing or invalid auth header');
    }

    const key = authHeader.slice(7);

    if (key != SECRET_API_CONTROL_KEY) {
        if (PUBLIC_DEV) console.log('attempt to access with a wrong key');
        throw sverror(401, 'wrong key, no tomatoes for you.');
    }

    const rqdata = await request.json();
    const link = rqdata.link;

    const supabase = getSupabaseDataClient();

    if (!link) {
        // updating everything
        const {data: seldata, error: selerror} = await supabase
            .from('nifties')
            .select('*');

        if (selerror || !seldata) {
            if (PUBLIC_DEV) console.error(selerror);
            throw sverror(500, "Could not get the nifty stuff!")
        }

        const results = await Promise.all(
            seldata.map(async nift => {
                const res = await updatePuppeteerData(nift.link);
                return { link: nift.link, success: res.success };
            })
        );
        const failures = results.filter(r => !r.success);
        if (failures.length) {
            console.error("Failed to update: ", failures)
            return new Response(JSON.stringify({success: false, failures}), {
                headers: {"Content-Type": "application/json"},
                status: 500
            });
        }
    } else {
        // updating one thing
        const res = await updatePuppeteerData(link);
        if (!res.success) console.error("Something went wrong when getting data");
    }

    if (PUBLIC_DEV) console.log("Update successful!");

    return new Response(JSON.stringify({success: true}), {
        headers: {"Content-Type": "application/json"}
    });
};