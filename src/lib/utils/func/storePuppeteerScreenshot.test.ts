import {describe, it, expect, vi} from "vitest";
import {storePuppeteerScreenshot} from "$lib/utils/func/storePuppeteerScreenshot";

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
        expect(await storePuppeteerScreenshot(null, null)).toEqual({success: false});
    });

    it('fails if Supabase returns error', async () => {
        uploadMock.mockResolvedValueOnce({ error: 'explosion' });

        expect(await storePuppeteerScreenshot(strBlob, 'whatever'))
            .toEqual({success: false});
    })

    it('succeeds if all is valid', async () => {
        uploadMock.mockResolvedValueOnce({ error: null });

        expect(await storePuppeteerScreenshot(strBlob, 'whatever')).toEqual({success: true});
    });
});