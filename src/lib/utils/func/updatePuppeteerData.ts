import puppeteer from "puppeteer";
import {storePuppeteerScreenshot} from "$lib/utils/func/storePuppeteerScreenshot";

export const updatePuppeteerData = async (link: string) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(link);
        await page.setViewport({width: 1536, height: 864});

        // Getting title
        const title = await page.title();

        if (!title) {console.error(400, 'No title (oh no)'); return {success: false}}

        // Getting screenshot
        const buffer = await page.screenshot({
            type: 'png',
            fullPage: true
        }) as Uint8Array<ArrayBuffer>;

        const blob = new Blob([buffer], {type: "image/png"});

        await storePuppeteerScreenshot(blob, title);

        return {success: true};
    } catch (error) {
        console.error('Failed to update site data miserably', error);
        return {success: false};
    }
}
