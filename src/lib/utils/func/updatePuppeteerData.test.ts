import {describe, it, expect} from "vitest";
import {updatePuppeteerData} from "$lib/utils/func/updatePuppeteerData";

const SECONDS = 1000;

describe('updatePuppeteerData', () => {
    it('fails if no title', async () => {
        expect(await updatePuppeteerData('e')).toEqual({success: false});
    }, 30 * SECONDS);

    it('succeeds if it survived that far', async () => {
        expect(await updatePuppeteerData('https://pnpm.io/')).toEqual({success: true});
    }, 30 * SECONDS);
})