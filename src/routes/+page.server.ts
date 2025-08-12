import {getSupabaseDataClient} from "$lib/utils/getSupabaseDataClient";
import {PUBLIC_DEV} from "$env/static/public"
import {error as sverror} from "@sveltejs/kit";

export const prerender = true;

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