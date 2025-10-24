const { chromium } = require('playwright');
const path = require('path');

async function testWebGL() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check for WebGL context and rendering
    const rendererDebug = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const pixelData = canvas.getContext('2d').getImageData(0, 0, 10, 10);
        const pixels = pixelData.data;

        // Check if image is all black (0, 0, 0)
        const isAllBlack = Array.from(pixels).every((val, i) => {
            if (i % 4 === 3) return true; // Skip alpha
            return val === 0;
        });

        return {
            canvasSize: { width: canvas.width, height: canvas.height },
            is2DContext: true,
            isAllBlackSample: isAllBlack,
            rendererContextExists: !!window.renderer._context
        };
    });

    console.log('🔍 WebGL Debug Info:');
    console.log(JSON.stringify(rendererDebug, null, 2));

    // Take screenshot
    await page.screenshot({ path: path.join(__dirname, 'webgl-debug-screenshot.png') });
    console.log('📸 Screenshot saved to webgl-debug-screenshot.png');

    await browser.close();
}

testWebGL().catch(console.error);
