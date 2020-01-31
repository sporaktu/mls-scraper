const puppeteer = require('puppeteer');
const mls = require('./mls-links.json');

async function getPage(link) {
    const BROWSER = await puppeteer.launch({headless: true});
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(link)
    await PAGE.setViewport({width: 1200, height: 1000});
    await PAGE.waitFor(1000);

    await PAGE.evaluate(() => {
        let houses = document.querySelectorAll(
            '.j-resultsPageAsyncDisplays .multiLineDisplay:not(.nonresponsive)');
        if (!houses || houses.length <= 0) return;
        houses.forEach(house => {
            let sqft = parseInt(
                house.querySelector(
                    '.col-lg-7 .col-sm-12.d-marginLeft--10 .d-textStrong.d-paddingRight--4')
                    .innerHTML
                    .replace(/,/g, ""));
            let favoriteButton = house.querySelector('.dropdown a');
            // Break if house's square footage is 0 (possible mistake in listing) or greater than 2000
            if (sqft === 0 || sqft >= 2000) return;
            console.log(house.querySelector('.d-fontSize--largest a').innerHTML, sqft);
            console.log(favoriteButton)
            favoriteButton.click();
            let discardButton = house.querySelector('.dropdown .mtx-bucket--discards a');
            console.log(discardButton);
            discardButton.click();
        })
    })
    await BROWSER.close();
}

async function processAllMLSLinks() {
    await mls.links.forEach(function(link) {
       getPage(link.url);
    })
}

processAllMLSLinks();
