import {getSupabaseAdminClient} from "$lib/utils/getSupabaseAdminClient";
import {sanitizeFileName} from "$lib/utils/sanitizeFileName";

export const storeImageInSupabaseBucket = async (blob: Blob, bucket: string, name: string, extension: string) => {
    const supabase = getSupabaseAdminClient();

    if (!blob || !name) {
        return {success: false};
    }

    const {error} = await supabase
        .storage
        .from(bucket)
        .upload(`${sanitizeFileName(name)}.${extension}`, blob, {
            contentType: `image/${extension}`,
            upsert: true,
        });

    if (error) {
        console.log('oh hi');
        console.log(sanitizeFileName(name));
        console.error(error);
        return {success: false};
    }

    console.info(`Stored ${name}.${extension} successfully`);

    return {success: true};
}