import puppeteer from "puppeteer";
import {storeImageInSupabaseBucket} from "$lib/utils/func/storeImageInSupabaseBucket";
import {getSupabaseAdminClient} from "$lib/utils/getSupabaseAdminClient";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {PUBLIC_DEV} from "$lib";
import {sanitizeFileName} from "$lib/utils/sanitizeFileName";

const delay = (time: number) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

export const updatePuppeteerData = async (link: string) => {
    try {
        //
        // Getting all the data
        //
        const browser = await puppeteer.launch({
            // headless: false,
        });
        const page = await browser.newPage();

        await page.goto(link, {waitUntil: "networkidle0"});
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36");
        await page.setViewport({width: 1536, height: 864});

        await delay(2000);

        // Getting title
        const title = await page.title();

        if (!title) {
            console.error(400, 'No title (oh no)');
            return {success: false}
        }

        if (title === "Just a moment...") {
            console.error(400, 'Got CAPTCHA\'d: ', link);
            return {success: false}
        }

        // Getting screenshot

        // first we remove the scrollbar because ugly
        await page.addStyleTag({
            content: `
                        ::-webkit-scrollbar { display: none !important; }
                        body { scrollbar-width: none; -ms-overflow-style: none; }
                     `
        });

        const buffer = await page.screenshot({
            type: 'webp',
            fullPage: false,
        }) as Uint8Array<ArrayBuffer>;

        const blob = new Blob([buffer], {type: "image/webp"});

        // Storing the screenshot in a bucket
        const res = await storeImageInSupabaseBucket(blob, 'screenshots', title, 'webp');
        if (!res.success) {
            console.error('Failed to store screenshot miserably', res);
            return {success: false};
        }

        // Getting favicon and storing it in a bucket,
        // I would just get a link to it, but that would probably be bad performance-wise on-scale
        let faviconUrl = await page.evaluate(() => {
            const iconLink: HTMLLinkElement | null = document.querySelector('link[rel~="icon"][type="image/svg+xml"]')
                || document.querySelector('link[rel="icon"]')
                || document.querySelector('link[rel="shortcut icon"]');
            if (!iconLink) {
                return null;
            }
            return iconLink.href;
        });

        if (!faviconUrl) {
            console.warn('No favicon link, trying /favicon.ico: ', link);
            faviconUrl = `${link}/favicon.ico`;
        }

        const favRes = await fetch(faviconUrl);
        if (!favRes.ok) {
            if (PUBLIC_DEV) console.error(favRes);
            return {success: false}
        }

        const favExtension = faviconUrl.split('.').pop();
        if (!favExtension) {
            if (PUBLIC_DEV) console.warn("No favicon extension. Site has no favicon?: ", link);
        } else {
            const favBlob = await favRes.blob();
            await storeImageInSupabaseBucket(favBlob, 'favicons', `fav-${title}`, favExtension);
        }

        // Storing the meta description
        let metadesc = await page.evaluate(() => {
            const descELem: HTMLLinkElement | null = document.querySelector('meta[name="description"]') || document.querySelector('meta[name="og:description"]') || document.querySelector('meta[name="twitter:description"]');
            if (!descELem) {
                return null;
            }
            return descELem.getAttribute('content');
        });


        //
        // Updating all te data
        //
        const supabase = getSupabaseAdminClient();

        const {error: upderror} = await supabase
            .from('nifties')
            .update({
                screenshot: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/${sanitizeFileName(title)}.webp`,
                title: title,
                favicon: favExtension ? `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/favicons/fav-${title}.${favExtension}` : `/img/favicon-skill-issue.svg`,
                metadesc: metadesc ?? 'No description provided by the site.',
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
