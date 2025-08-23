import {type Actions, error as sverror} from "@sveltejs/kit";
import {createServerClient} from "@supabase/ssr";
import {SECRET_API_CONTROL_KEY} from "$env/static/private";
import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

export const actions = {
    preview: async ({ cookies, request, fetch: eventFetch }) => {
        // updating the preview on the page
        // auth first ofc

        // @ts-ignore dear IDE, it's not deprecated, you misread
        const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                getAll: () => cookies.getAll(),
                setAll: () => cookies.setAll(),
                delete: (name: any, options: any) => cookies.delete(name, options)
            }
        })

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (authError) {
            return { success: false, threat: 'Uhm, uhm, who are you??'};
        }

        //

        const formData = await request.formData();
        const link = formData.get('link');

        try {
            const res = await eventFetch('/api/v1/update', {
                method: 'POST',
                body: JSON.stringify({
                    link: link,
                    nodb: true
                }),
                headers: {
                    'authorization': `Bearer ${SECRET_API_CONTROL_KEY}`
                }
            });
            const resJSON = await res.json();
            return { success: true, threat: 'Got preview for link successfully!', data: resJSON.data };
        } catch (error) {
            console.error(error);
            return { success: false, threat: 'Failed to update!'};
        }
    },
    add: async ({ cookies, request }) => {
        // @ts-ignore dear IDE, it's not deprecated, you misread
        const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                getAll: () => cookies.getAll(),
                setAll: () => cookies.setAll(),
                delete: (name: any, options: any) => cookies.delete(name, options)
            }
        })

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (authError) {
            return { success: false, threat: 'Uhm, uhm, who are you??'};
        }

        //

        const formData = await request.formData();
        const link = formData.get('link');
        const comment = formData.get('comment');
        const display_name = formData.get('display_name');
        const tags = formData.get('tags');
        const warning = formData.get('warning');
        const copyright = formData.get('copyright');

        if (typeof link !== 'string' || link.trim() === '') {
            throw sverror(400, "There is no link! Who is going to save Hyrule?");
        }

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
    stash: async ({ cookies, request }) => {
        // this one is admin to update

        // @ts-ignore dear IDE, it's not deprecated, you misread
        const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                getAll: () => cookies.getAll(),
                setAll: () => cookies.setAll(),
                delete: (name: any, options: any) => cookies.delete(name, options)
            }
        })

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (authError) {
            return { success: false, threat: 'Uhm, uhm, who are you??'};
        }

        //

        const formData = await request.formData();
        const link = formData.get('link');

        if (typeof link !== 'string' || link.trim() === '') {
            throw sverror(400, "There is no link! Who is going to destroy Hyrule?");
        }

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