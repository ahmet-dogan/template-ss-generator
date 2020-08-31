const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fsPromises = require('fs').promises;

const openFormPage = async ({browser, formID}) => {
    const formUrl = 'https://www.jotform.com/' + formID;
    const page = await browser.newPage();
    await page.setCacheEnabled(true);
    await page.goto(formUrl, {waitUntil: 'networkidle0'});
    return {page, browser};
};

const getFormBackground = async ({page, formID}) => {
    const backgroundFileName = formID + '-bg.jpg';
    let background, backgroundType;
    
    const {backgroundImage, backgroundColor} = await page.evaluate(() => {
        var backgroundColor = window.getComputedStyle(document.querySelector('body')).backgroundColor;
        if (backgroundColor === 'rgba(0, 0, 0, 0)') {
            backgroundColor = window.getComputedStyle(document.querySelector('html')).backgroundColor;
        }
        
        return {
            backgroundImage: window.getComputedStyle(document.querySelector('html')).backgroundImage,
            backgroundColor: backgroundColor
        }
    });
    
    if (backgroundImage !== 'none') {
        await page.evaluate(() => {
            document.querySelector('.jotform-form').style.display = 'none';
        });
        const htmlElement = await page.$('html');
        const backgroundImageBuffer = await htmlElement.screenshot();
        await sharp(backgroundImageBuffer)
            .resize({
                width: 340,
                height: 254
            })
            .jpeg()
            .toFile(backgroundFileName);
        
        background = backgroundFileName;
        backgroundType = 'image';
    } else {
        background = backgroundColor;
        backgroundType = 'color';
    }
    
    return {background, backgroundType};
};

const getFormAreaScreenshot = async ({page, backgroundType, background, formID}) => {
    const formSsFileName = formID + '-form.png';
    await page.evaluate(() => {
        document.querySelector('.jotform-form').style.display = null;
        document.body.style.background = 'transparent';
        document.querySelector('html').style.background = 'transparent';
        
        // clear border and shadow styles
        document.querySelector('.form-all').style.setProperty('border-radius', '0', 'important');
        document.querySelector('.form-all').style.setProperty('border', '0', 'important');
        document.querySelector('.form-all').style.setProperty('box-shadow', 'none', 'important');
    });
    
    const form = await page.$('.form-all');
    
    const formImageBuffer = await form.screenshot({
        omitBackground: (backgroundType === 'image') || (background !== 'rgba(0, 0, 0, 0)')
    });
    
    await sharp(formImageBuffer)
        .resize({width: 296})
        .png({progressive: true})
        .toFile(formSsFileName);
    
    return formSsFileName;
};

const getFormScreenshot = async ({browser, formID}) => {
    const tic = new Date();
    console.log('[' + formID + '] Started');
    
    const {page} = await openFormPage({browser, formID});
    console.log('[' + formID + '] Page ready');
    
    const {background, backgroundType} = await getFormBackground({page, formID});
    console.log('[' + formID + '] Background ready');
    
    const form = await getFormAreaScreenshot({page, backgroundType, background, formID});
    console.log('[' + formID + '] Form screenshot ready');
    
    await page.close();
    console.log('[' + formID + '] Done');
    
    const processTime = new Date() - tic;
    console.log('[' + formID + '] Process time: ' + processTime + 'ms');
    
    return {background, backgroundType, form, processTime};
};

(async () => {
    const browser = await puppeteer.launch({headless: true});
    
    const formIDs = [
        '20903075693455',   // example 1 : image background, transparent form
        '20853367294460',   // example 2 : image background, transparent form
        '20864245705555',   // example 3 : image background, transparent form
        '21121721295444',   // example 4 : default background, color form
        '200772726817056',  // example 5 : color background, color form
        '21413914171344',   // example 6 : default background, color form
        '21092334609349',   // example 7 : default background, color form ??????????
        '20575198773162',   // example 8 : default background, color form
        '21224672668255',
        '90381893295468',
        '40301708378957',   // TODO: broken
        '201173375469055'
    ];
    
    let results = [];
    
    // TODO: run parallel
    for (let i = 0; i < formIDs.length; i++) {
        const formID = formIDs[i];
        try {
            const result = await getFormScreenshot({browser, formID});
            results.push(result);
        } catch (err) {
            console.error('[' + formID + '] Failed!');
            console.error(err);
        }
    }
    
    await browser.close();
    
    // TODO: send results and upload files
    await fsPromises.writeFile('results.js', 'window.results = ' + JSON.stringify(results, null, 2));
    
    // TODO: remove files
    
    process.exit(0);
})();
