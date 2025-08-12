import puppeteer from "puppeteer";

export const getPuppeteerData = async (link: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(link);
    await page.setViewport({width: 1536, height: 864});

    // Getting title
    // const h1 = page.locator('h1');
    // await h1.wait();
    // console.log(h1);


    const title = await page.title();

    // Getting screenshot
    await page.screenshot({
        path: `a${''}.png`,
        fullPage: true
    });

    return 'hi';
}
