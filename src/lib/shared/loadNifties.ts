import {getSupabaseDataClient} from "$lib/utils/getSupabaseDataClient";
import {PUBLIC_DEV} from "$lib";
import {error as sverror} from "@sveltejs/kit";
import {shuffle} from "$lib/utils/shuffle";

export const loadNifties = async (includeStashed = false) => {
    const supabase = getSupabaseDataClient();

    let {data: nifties, error: selerror} = await supabase
        .from('nifties')
        .select('*');

    if (selerror || !nifties) {
        if (PUBLIC_DEV) console.error(selerror);
        throw sverror(500, "Could not get the nifty stuff!")
    }

    if (!includeStashed) {
        nifties = nifties.filter((nift) => !nift.stashed);
    }

    type TagCategories = {
        what: string[];
        which: string[];
        why: string[];
    };
    const keys = ['what', 'which', 'why'] as const;
    type TagKey = typeof keys[number];

    const tags = keys.reduce((acc, key: TagKey) => {
        acc[key] = [...new Set(nifties?.flatMap(n => n.tags[key] || []))];
        return acc;
    }, {} as TagCategories);

    nifties = shuffle(nifties);

    return {nifties, tags};
}