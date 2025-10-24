const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8080';

async function testImprovements() {
    let browser;
    try {
        console.log('🔍 測試Minimap和內部場景改進...\n');

        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        // 加載頁面
        console.log('📍 加載頁面...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // 測試1: Minimap初始化
        console.log('\n[測試1] Minimap初始化');
        const minimapCanvas = await page.locator('#minimap-canvas');
        const minimapVisible = await minimapCanvas.isVisible();
        console.log(`✓ Minimap Canvas可見: ${minimapVisible ? '✅' : '❌'}`);

        const minimapSize = await page.evaluate(() => {
            const canvas = document.getElementById('minimap-canvas');
            return canvas ? { width: canvas.width, height: canvas.height } : null;
        });
        console.log(`✓ Minimap尺寸: ${minimapSize.width}x${minimapSize.height}`);

        // 測試2: 樓層切換時更新minimap
        console.log('\n[測試2] 樓層切換更新Minimap');
        const floor2Fbtn = await page.locator('button:has-text("2F")');
        await floor2Fbtn.click();
        await page.waitForTimeout(1000);

        const currentFloor2F = await page.evaluate(() => window.currentFloor);
        console.log(`✓ 當前樓層: ${currentFloor2F}`);

        // 取minimap的像素數據
        const minimapData2F = await page.evaluate(() => {
            const canvas = document.getElementById('minimap-canvas');
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let nonBlackPixels = 0;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 50 || data[i+1] > 50 || data[i+2] > 50) {
                    nonBlackPixels++;
                }
            }
            return nonBlackPixels;
        });
        console.log(`✓ Minimap繪製的像素數: ${minimapData2F} (2F樓層)`);

        // 取截圖
        await page.screenshot({ path: 'test-results/test-minimap-2F.png' });
        console.log('📸 截圖: test-results/test-minimap-2F.png');

        // 測試3: 內部導覽模式
        console.log('\n[測試3] 內部導覽模式');
        const interiorBtn = await page.locator('button:has-text("內部導覽")');
        await interiorBtn.click();
        await page.waitForTimeout(1000);

        const currentMode = await page.evaluate(() => window.currentMode);
        console.log(`✓ 當前模式: ${currentMode === 'interior' ? '✅ interior' : '❌ ' + currentMode}`);

        // 取截圖
        await page.screenshot({ path: 'test-results/test-interior-mode.png' });
        console.log('📸 截圖: test-results/test-interior-mode.png');

        // 測試4: 回到外部視角
        console.log('\n[測試4] 外部視角');
        const exteriorBtn = await page.locator('button:has-text("外部視角")');
        await exteriorBtn.click();
        await page.waitForTimeout(1000);

        const exteriorMode = await page.evaluate(() => window.currentMode);
        console.log(`✓ 當前模式: ${exteriorMode === 'exterior' ? '✅ exterior' : '❌ ' + exteriorMode}`);

        // 取截圖
        await page.screenshot({ path: 'test-results/test-exterior-mode.png' });
        console.log('📸 截圖: test-results/test-exterior-mode.png');

        console.log('\n✅ 所有測試完成！');

    } catch (error) {
        console.error('❌ 測試失敗:', error.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

testImprovements().catch(console.error);
