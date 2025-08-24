import {getSupabaseDataClient} from "$lib/utils/getSupabaseDataClient";
import {error as sverror} from "@sveltejs/kit";
import {PUBLIC_DEV} from "$lib";
import {SECRET_API_CONTROL_KEY} from "$env/static/private";
import {loadNifties} from "$lib/shared/loadNifties";

// cfg enable later
// export const prerender = true;

export const actions = {
    testApiUpdateAll: async (event) => {
        console.info('testApiAll called');
        try {
            await event.fetch('/api/v1/update', {
                method: 'POST',
                body: JSON.stringify({
                    link: null
                }),
                headers: {
                    'authorization': `Bearer ${SECRET_API_CONTROL_KEY}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    testApiUpdateSpecific: async (event) => {
        console.info('testApiSpecific called');
        try {
             await event.fetch('/api/v1/update', {
                method: 'POST',
                body: JSON.stringify({
                    link: 'https://cssgrid-generator.netlify.app/'
                }),
                headers: {
                    'authorization': `Bearer ${SECRET_API_CONTROL_KEY}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
};

export const load = async () => {
    return loadNifties();
}