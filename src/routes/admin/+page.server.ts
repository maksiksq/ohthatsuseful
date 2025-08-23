import {type Actions, error as sverror} from "@sveltejs/kit";
import {getSupabaseAdminClient} from "$lib/utils/getSupabaseAdminClient";

export const actions = {
    add: async (e) => {
        const formData = await e.request.formData();
        const link = formData.get('link');
        const comment = formData.get('comment');
        const display_name = formData.get('display_name');
        const tags = formData.get('tags');
        const warning = formData.get('warning');
        const copyright = formData.get('copyright');

        if (typeof link !== 'string' || link.trim() === '') {
            throw sverror(400, "There is no link! Who is going to save Hyrule?");
        }

        const supabase = getSupabaseAdminClient();

        const {error: inerror} = await supabase
            .from('nifties')
            .upsert({
                link,
                comment,
                display_name,
                tags,
                warning,
                copyright
            });

        if (inerror) {
            throw sverror(500, `Oh no. Could not add an entry: ${inerror.message}`);
        }

        return {success: true, threat: `Added a brand new ${display_name} successfully.`};
    },
    stash: async (e) => {
        const formData = await e.request.formData();
        const link = formData.get('link');

        if (typeof link !== 'string' || link.trim() === '') {
            throw sverror(400, "There is no link! Who is going to destroy Hyrule?");
        }

        const supabase = getSupabaseAdminClient();

        const {error: upderror} = await supabase
            .from('nifties')
            .update({
                stashed: true
            })
            .eq('link', link);

        if (upderror) {
            throw sverror(500, `Oh no. Could not stash entry: ${upderror}`);
        }

        return {success: true, threat: `Stashed ${link} successfully.`};
    }
} satisfies Actions;