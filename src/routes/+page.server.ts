import {getSupabaseDataClient} from "$lib/utils/getSupabaseDataClient";

export const load = () => {
    const supabase = getSupabaseDataClient();

    const {data, error: selerror} = await supabase
        .from('nifties')
        .select()
}