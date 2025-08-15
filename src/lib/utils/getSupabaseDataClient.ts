import {createClient, type SupabaseClient} from "@supabase/supabase-js";
import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

let supabase: SupabaseClient | null = null;
export const getSupabaseDataClient = () => {
    if (!supabase) {
        return supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
    }
    return supabase;
}