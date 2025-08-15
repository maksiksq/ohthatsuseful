import {getSupabaseDataClient} from "$lib/utils/getSupabaseDataClient";
import {error as sverror} from "@sveltejs/kit";
import {PUBLIC_DEV} from "$lib";
import {SECRET_API_CONTROL_KEY} from "$env/static/private";

// cfg enable later
// export const prerender = true;

export const actions = {
    testApi: async (event) => {
        console.log('testApi called');
        try {
             await event.fetch('/api/v1/update-all-data', {
                method: 'POST',
                body: 'blank',
                headers: {
                    'authorization': `Bearer ${SECRET_API_CONTROL_KEY}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }};

export const load = async () => {
    const supabase = getSupabaseDataClient();

    const {data, error: selerror} = await supabase
        .from('nifties')
        .select('*');

    if (selerror || !data) {
        if (PUBLIC_DEV) console.error(selerror);
        throw sverror(500, "Could not get the nifty stuff!")
    }

    return {nifties: data};
}