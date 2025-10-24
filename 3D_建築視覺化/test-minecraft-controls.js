const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8080';

async function testMinecraftControls() {
    let browser;
    try {
        console.log('🎮 測試 Minecraft 風格相機控制...\n');

        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        // 加載頁面
        console.log('📍 加載頁面...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // 切換到內部導覽模式
        console.log('\n[測試1] 切換到內部導覽模式');
        const interiorBtn = await page.locator('button:has-text("內部導覽")');
        await interiorBtn.click();
        await page.waitForTimeout(1000);

        const currentMode = await page.evaluate(() => window.currentMode);
        console.log(`✓ 當前模式: ${currentMode}`);

        // 記錄初始相機位置
        const initialPos = await page.evaluate(() => ({
            x: window.fpsCamera?.position.x,
            y: window.fpsCamera?.position.y,
            z: window.fpsCamera?.position.z,
            pitch: window.minecraftControls?.pitch,
            yaw: window.minecraftControls?.yaw
        }));
        console.log(`✓ 初始位置: (${initialPos.x.toFixed(2)}, ${initialPos.y.toFixed(2)}, ${initialPos.z.toFixed(2)})`);
        console.log(`✓ 初始旋轉: pitch=${initialPos.pitch?.toFixed(3)}, yaw=${initialPos.yaw?.toFixed(3)}`);

        // 測試 WASD 鍵盤移動
        console.log('\n[測試2] 測試 WASD 鍵盤移動');

        // 模擬按下 W 鍵（向前）
        await page.keyboard.press('w');
        await page.keyboard.press('w');
        await page.keyboard.press('w');
        await page.waitForTimeout(500);

        const afterWKey = await page.evaluate(() => ({
            x: window.fpsCamera?.position.x,
            y: window.fpsCamera?.position.y,
            z: window.fpsCamera?.position.z
        }));
        console.log(`✓ 按 W 後位置: (${afterWKey.x.toFixed(2)}, ${afterWKey.y.toFixed(2)}, ${afterWKey.z.toFixed(2)})`);
        console.log(`✓ 位移距離: ${Math.sqrt(
            Math.pow(afterWKey.x - initialPos.x, 2) +
            Math.pow(afterWKey.z - initialPos.z, 2)
        ).toFixed(3)}`);

        // 測試滑鼠移動（相機旋轉）
        console.log('\n[測試3] 測試滑鼠移動（相機旋轉）');

        // 模擬滑鼠移動
        await page.mouse.move(960, 540);
        await page.mouse.move(960 + 100, 540);  // 向右移動 100px
        await page.waitForTimeout(200);

        const afterMouseMove = await page.evaluate(() => ({
            pitch: window.minecraftControls?.pitch,
            yaw: window.minecraftControls?.yaw
        }));
        console.log(`✓ 滑鼠右移後: pitch=${afterMouseMove.pitch?.toFixed(3)}, yaw=${afterMouseMove.yaw?.toFixed(3)}`);
        console.log(`✓ Yaw 變化: ${Math.abs((afterMouseMove.yaw || 0) - (initialPos.yaw || 0)).toFixed(3)} rad`);

        // 切換到 FPS 模式測試
        console.log('\n[測試4] 切換到第一人稱模式');
        const fpsBtn = await page.locator('button:has-text("第一人稱")');
        await fpsBtn.click();
        await page.waitForTimeout(1000);

        const fpsMode = await page.evaluate(() => window.currentMode);
        console.log(`✓ 當前模式: ${fpsMode}`);

        // 測試 FPS 模式的移動
        console.log('\n[測試5] FPS 模式 - WASD 移動');

        const fpsBefore = await page.evaluate(() => ({
            x: window.fpsCamera?.position.x,
            y: window.fpsCamera?.position.y,
            z: window.fpsCamera?.position.z
        }));
        console.log(`✓ FPS 初始位置: (${fpsBefore.x.toFixed(2)}, ${fpsBefore.y.toFixed(2)}, ${fpsBefore.z.toFixed(2)})`);

        // 按 D 鍵（向右）
        await page.keyboard.press('d');
        await page.keyboard.press('d');
        await page.keyboard.press('d');
        await page.waitForTimeout(500);

        const fpsAfter = await page.evaluate(() => ({
            x: window.fpsCamera?.position.x,
            y: window.fpsCamera?.position.y,
            z: window.fpsCamera?.position.z
        }));
        console.log(`✓ 按 D 後位置: (${fpsAfter.x.toFixed(2)}, ${fpsAfter.y.toFixed(2)}, ${fpsAfter.z.toFixed(2)})`);

        // 驗證結果
        console.log('\n✅ 驗證結果:');
        const hasMoved = Math.abs(afterWKey.x - initialPos.x) > 0.01 || Math.abs(afterWKey.z - initialPos.z) > 0.01;
        const hasRotated = Math.abs((afterMouseMove.yaw || 0) - (initialPos.yaw || 0)) > 0.01;

        console.log(`✓ WASD 移動有效: ${hasMoved ? '✅' : '❌'}`);
        console.log(`✓ 滑鼠旋轉有效: ${hasRotated ? '✅' : '❌'}`);
        console.log(`✓ 內部導覽模式運作: ${currentMode === 'interior' ? '✅' : '❌'}`);
        console.log(`✓ FPS 模式運作: ${fpsMode === 'fps' ? '✅' : '❌'}`);

        await page.screenshot({ path: 'test-results/minecraft-controls-test.png' });
        console.log('\n📸 截圖: test-results/minecraft-controls-test.png');

        console.log('\n✅ Minecraft 風格相機控制測試完成！');

    } catch (error) {
        console.error('❌ 測試失敗:', error.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

testMinecraftControls().catch(console.error);
