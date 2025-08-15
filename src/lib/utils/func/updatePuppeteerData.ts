import puppeteer from "puppeteer";
import {storePuppeteerScreenshot} from "$lib/utils/func/storePuppeteerScreenshot";
import {getSupabaseAdminClient} from "$lib/utils/getSupabaseAdminClient";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {PUBLIC_DEV} from "$lib";

export const updatePuppeteerData = async (link: string) => {
    try {
        //
        // Getting all the data
        //
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(link);
        await page.setViewport({width: 1536, height: 864});

        // Getting title
        const title = await page.title();

        if (!title) {
            console.error(400, 'No title (oh no)');
            return {success: false}
        }

        // Getting screenshot
        const buffer = await page.screenshot({
            type: 'webp',
            fullPage: true
        }) as Uint8Array<ArrayBuffer>;

        const blob = new Blob([buffer], {type: "image/webp"});

        // storing the screenshot in a bucket
        const res = await storePuppeteerScreenshot(blob, title);
        if (!res.success) {
            console.error('Failed to store screenshot miserably', res);
            return {success: false};
        }

        // getting favicon
        let favicon = await page.evaluate(() => {
            const iconLink: HTMLLinkElement | null = document.querySelector('link[rel~="icon"][type="image/svg+xml"]')
                || document.querySelector('link[rel="icon"]')
                || document.querySelector('link[rel="shortcut icon"]');
            if (!iconLink) {
                return null;
            }
            return iconLink.href;
        });

        if (!favicon) {
            console.warn('No favicon link, trying /favicon.ico');
            favicon = `${link}/favicon.ico`;
        }

        //
        // Updating all te data
        //
        const supabase = getSupabaseAdminClient();

        const {error: upderror} = await supabase
            .from('nifties')
            .update({
                screenshot: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/${title}.webp`,
                title: title,
                favicon: favicon
            })
            .eq('link', link);


        if (upderror) {
            console.error('Failed to update site data miserably', upderror);
            return {success: false};
        }

        await browser.close();
        return {success: true};
    } catch (error) {
        console.error('Something went wrong miserably oh no', error);
        return {success: false};
    }
}
