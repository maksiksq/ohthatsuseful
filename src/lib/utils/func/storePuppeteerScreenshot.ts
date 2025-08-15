import {getSupabaseAdminClient} from "$lib/utils/getSupabaseAdminClient";

export const storePuppeteerScreenshot = async (blob: Blob, name: string) => {
    const supabase = getSupabaseAdminClient();

    if (!blob || !name) {
        return {success: false};
    }

    const {error} = await supabase
        .storage
        .from('screenshots')
        .upload(`${name}.webp`, blob, {
            contentType: 'image/webp',
            upsert: true,
        });

    if (error) {
        console.log(error);
        return {success: false};
    }

    return {success: true};
}