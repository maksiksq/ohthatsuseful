import {createClient, type SupabaseClient} from "@supabase/supabase-js";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {SECRET_SUPABASE_SERVICE_ROLE_KEY} from "$env/static/private";

let supabase: SupabaseClient | null = null;
export const getSupabaseAdminClient = () => {
    if (!supabase) {
        return supabase = createClient(PUBLIC_SUPABASE_URL, SECRET_SUPABASE_SERVICE_ROLE_KEY);
    }
    return supabase;

}