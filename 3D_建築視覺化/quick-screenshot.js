const { chromium } = require('playwright');
const path = require('path');

async function takeScreenshot() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // Take screenshot
        await page.screenshot({ path: path.join(__dirname, 'ui-current-state.png') });
        console.log('✅ Screenshot saved: ui-current-state.png');
        
    } finally {
        await browser.close();
    }
}

takeScreenshot().catch(console.error);
