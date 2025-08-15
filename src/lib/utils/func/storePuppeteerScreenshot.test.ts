import {describe, it, expect, vi} from "vitest";
import {storeImageInSupabaseBucket} from "$lib/utils/func/storeImageInSupabaseBucket";

const strBlob = new Blob(['fake data'], { type: "text/plain" });

const uploadMock = vi.fn();

vi.mock("$lib/utils/getSupabaseAdminClient", () => ({
    getSupabaseAdminClient: () => ({
        storage: {
            from: () => ({
                upload: uploadMock
            })
        }
    })
}));

describe('storePuppeteerScreenshot', () => {
    it('fails if no screenshot', async () => {
        // @ts-expect-error testing invalid input
        expect(await storeImageInSupabaseBucket(null, null, null, null)).toEqual({success: false});
    });

    it('fails if Supabase returns error', async () => {
        uploadMock.mockResolvedValueOnce({ error: 'explosion' });

        expect(await storeImageInSupabaseBucket(strBlob, 'screenshots','whatever', 'webp'))
            .toEqual({success: false});
    })

    it('succeeds if all is valid', async () => {
        uploadMock.mockResolvedValueOnce({ error: null });

        expect(await storeImageInSupabaseBucket(strBlob, 'screenshots', 'whatever', 'webp')).toEqual({success: true});
    });
});