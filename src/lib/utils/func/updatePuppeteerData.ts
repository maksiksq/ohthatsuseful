import puppeteer, {TimeoutError} from "puppeteer";
import {storeImageInSupabaseBucket} from "$lib/utils/func/storeImageInSupabaseBucket";
import {getSupabaseAdminClient} from "$lib/utils/getSupabaseAdminClient";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {PUBLIC_DEV} from "$lib";
import {sanitizeFileName} from "$lib/utils/sanitizeFileName";
import sharp from "sharp";

const delay = (time: number) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

export const updatePuppeteerData = async (link: string, nodb: boolean = false) => {
    try {
        //
        // Getting all the data
        //
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();

        try {
            await page.goto(link, {waitUntil: "networkidle0"});
        } catch (err) {
            console.error(500, 'debuggggg: ', link);
            try {
                await page.goto(link, {waitUntil: "domcontentloaded"});
            } catch {
                console.error(500, 'Failed to get page: ', link);
                return {success: false}
            }
        }

        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36");
        await page.setViewport({width: 1536, height: 864});

        await delay(3000);

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

        // First we're removing the scrollbar because ugly
        await page.evaluate(() => {
            const style = document.createElement('style');
            style.textContent = `
        ::-webkit-scrollbar { display: none !important; }
        body { scrollbar-width: none; -ms-overflow-style: none; }
    `;
            document.head.appendChild(style);
        });

        const buffer = await page.screenshot({
            type: 'png',
            fullPage: false,
        }) as Uint8Array<ArrayBuffer>;

        const blob = new Blob([buffer], {type: "image/png"});

        // we don't need to send the client the whole big screenshot but I want to store
        // it for historical purposes or if something goes wrong
        // neverthless, I'm resizing the real thing to be smol
        // shrap time weee

        // width tied to imgs
        const bufferSmol = await sharp(buffer)
            .resize(600, null, { kernel: "lanczos3" })
            .avif({quality: 80})
            .toBuffer() as Uint8Array<ArrayBuffer> as Uint8Array<ArrayBuffer>;

        const blobSmol = new Blob([bufferSmol], {type: "image/avif"});

        // Storing the smol screenshot in a bucket
        const resSmol = await storeImageInSupabaseBucket(blobSmol, 'screenshots', `smol-${title}`, 'avif');
        if (!resSmol.success) {
            console.error('Failed to store screenshot miserably', resSmol);
            return {success: false};
        }

        // Storing the not smol screenshot in a bucket
        const resOg = await storeImageInSupabaseBucket(blob, 'screenshots', title, 'avif');
        if (!resOg.success) {
            console.error('Failed to store screenshot miserably', resOg);
            return {success: false};
        }

        // Getting favicon and storing it in a bucket,
        // I would just get a link to it, but that would probably be bad performance-wise on-scale
        await page.waitForSelector('link[rel~="icon"], link[rel="shortcut icon"]', { timeout: 5000 }).catch(() => {});

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

        let dataImage = false;
        if (faviconUrl.startsWith('data:image')) {
            dataImage = true;
        }
        const favExtension = faviconUrl.split('.').pop();
        if (!dataImage) {
            const favRes = await fetch(faviconUrl);
            if (!favRes.ok) {
                if (PUBLIC_DEV) console.error(favRes);
                return {success: false}
            }

            if (!favExtension) {
                if (PUBLIC_DEV) console.warn("No favicon extension. Site has no favicon?: ", link);
            } else {
                const favBlob = await favRes.blob();
                await storeImageInSupabaseBucket(favBlob, 'favicons', `fav-${title}`, favExtension);
            }
        }

        // Storing the meta description
        let metadesc = await page.evaluate(() => {
            const descELem: HTMLLinkElement | null = document.querySelector('meta[name="description"]') || document.querySelector('meta[name="og:description"]') || document.querySelector('meta[name="twitter:description"]');
            if (!descELem) {
                return null;
            }
            return descELem.getAttribute('content');
        });

        const data = {
            link: link,
            screenshot: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/${sanitizeFileName(title)}.avif`,
            screenshot_smol: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/smol-${sanitizeFileName(title)}.avif`,
            title: title,
            favicon: dataImage ? faviconUrl : (favExtension ? `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/favicons/fav-${sanitizeFileName(title)}.${favExtension}` : `/img/favicon-skill-issue.svg`),
            metadesc: metadesc ?? 'No description provided by the site.',
        }

        //
        // If it's a draft for the dashboard preview, we just send everything in without updating the db
        //

        if (nodb) {
            await browser.close();
            return {success: true, data: {...data}};
        }

        //
        // Updating all the data
        //
        const supabase = getSupabaseAdminClient();

        const {error: upderror} = await supabase
            .from('nifties')
            .update({...data})
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
