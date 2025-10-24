const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8080';

async function testExteriorFloorNav() {
    let browser;
    try {
        console.log('🔍 測試外部視角樓層導航...\n');

        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        // 加載頁面
        console.log('📍 加載頁面...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // 確認目前在外部視角
        const initialMode = await page.evaluate(() => window.currentMode);
        console.log(`✓ 初始模式: ${initialMode}`);

        if (initialMode !== 'exterior') {
            console.log('⚠️  不在外部視角，切換到外部視角...');
            const exteriorBtn = await page.locator('button:has-text("外部視角")');
            await exteriorBtn.click();
            await page.waitForTimeout(1000);
        }

        // 獲取初始相機位置
        const initialCameraPos = await page.evaluate(() => ({
            x: window.orbitCamera?.position.x,
            y: window.orbitCamera?.position.y,
            z: window.orbitCamera?.position.z,
        }));
        console.log(`✓ 初始相機位置: (${initialCameraPos.x}, ${initialCameraPos.y}, ${initialCameraPos.z})`);

        // 測試1: 點擊 1F 按鈕
        console.log('\n[測試1] 點擊 1F 按鈕');
        const floor1FBtn = await page.locator('button:has-text("1F")');
        await floor1FBtn.click();
        await page.waitForTimeout(1000);

        const after1F = await page.evaluate(() => ({
            floor: window.currentFloor,
            cameraY: window.orbitCamera?.position.y,
            targetY: window.orbitControls?.target.y,
        }));
        console.log(`✓ 當前樓層: ${after1F.floor}`);
        console.log(`✓ 相機高度: ${after1F.cameraY}`);
        console.log(`✓ 軌道焦點Y: ${after1F.targetY}`);
        console.log(`✓ 預期相機高度: 47 (1F中心7 + 40)`);

        // 取截圖
        await page.screenshot({ path: 'test-results/exterior-1F.png' });
        console.log('📸 截圖: test-results/exterior-1F.png');

        // 測試2: 點擊 2F 按鈕
        console.log('\n[測試2] 點擊 2F 按鈕');
        const floor2FBtn = await page.locator('button:has-text("2F")');
        await floor2FBtn.click();
        await page.waitForTimeout(1000);

        const after2F = await page.evaluate(() => ({
            floor: window.currentFloor,
            cameraY: window.orbitCamera?.position.y,
            targetY: window.orbitControls?.target.y,
        }));
        console.log(`✓ 當前樓層: ${after2F.floor}`);
        console.log(`✓ 相機高度: ${after2F.cameraY}`);
        console.log(`✓ 軌道焦點Y: ${after2F.targetY}`);
        console.log(`✓ 預期相機高度: 50.75 (2F中心10.75 + 40)`);

        await page.screenshot({ path: 'test-results/exterior-2F.png' });
        console.log('📸 截圖: test-results/exterior-2F.png');

        // 測試3: 點擊 4F 按鈕
        console.log('\n[測試3] 點擊 4F 按鈕');
        const floor4FBtn = await page.locator('button:has-text("4F")');
        await floor4FBtn.click();
        await page.waitForTimeout(1000);

        const after4F = await page.evaluate(() => ({
            floor: window.currentFloor,
            cameraY: window.orbitCamera?.position.y,
            targetY: window.orbitControls?.target.y,
        }));
        console.log(`✓ 當前樓層: ${after4F.floor}`);
        console.log(`✓ 相機高度: ${after4F.cameraY}`);
        console.log(`✓ 軌道焦點Y: ${after4F.targetY}`);
        console.log(`✓ 預期相機高度: 57.75 (4F中心17.75 + 40)`);

        await page.screenshot({ path: 'test-results/exterior-4F.png' });
        console.log('📸 截圖: test-results/exterior-4F.png');

        // 驗證結果
        console.log('\n✅ 驗證結果:');
        console.log(`✓ 1F高度正確: ${Math.abs(after1F.cameraY - 47) < 0.5 ? '✅' : '❌'} (${after1F.cameraY})`);
        console.log(`✓ 2F高度正確: ${Math.abs(after2F.cameraY - 50.75) < 0.5 ? '✅' : '❌'} (${after2F.cameraY})`);
        console.log(`✓ 4F高度正確: ${Math.abs(after4F.cameraY - 57.75) < 0.5 ? '✅' : '❌'} (${after4F.cameraY})`);
        console.log(`✓ 相機有移動: ${initialCameraPos.y !== after1F.cameraY ? '✅' : '❌'}`);

        console.log('\n✅ 外部視角樓層導航測試完成！');

    } catch (error) {
        console.error('❌ 測試失敗:', error.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

testExteriorFloorNav().catch(console.error);
