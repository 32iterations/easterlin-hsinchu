const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testRendering() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🌐 打開網站...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });

    // 等待debug-log出現
    console.log('⏳ 等待模組加載...');
    await page.waitForSelector('#debug-log', { timeout: 10000 });

    // 等待一段時間讓模組加載完成
    await page.waitForTimeout(3000);

    // 檢查debug日誌
    const debugLog = await page.textContent('#debug-log');
    console.log('\n📋 調試日誌：');
    console.log(debugLog);

    // 檢查是否有錯誤
    const hasErrors = debugLog.includes('❌');
    const hasSuccess = debugLog.includes('✅');

    if (hasErrors) {
        console.log('\n⚠️  發現錯誤');
    }

    if (hasSuccess) {
        console.log('\n✅ 模組加載成功');
    }

    // 檢查 canvas 容器是否有實際尺寸
    const canvasContainer = await page.$('#canvas-container');
    if (canvasContainer) {
        const boundingBox = await canvasContainer.boundingBox();
        console.log(`\n📐 Canvas容器尺寸: ${boundingBox.width}x${boundingBox.height}`);

        if (boundingBox.width === 0 || boundingBox.height === 0) {
            console.log('❌ Canvas容器尺寸為0！');
        } else {
            console.log('✅ Canvas容器尺寸正常');
        }
    }

    // 檢查是否有canvas元素
    const canvases = await page.$$('canvas');
    console.log(`\n🎨 找到 ${canvases.length} 個 canvas 元素`);

    // 檢查全局變數是否已設置
    const THREE = await page.evaluate(() => window.THREE);
    const OrbitControls = await page.evaluate(() => window.OrbitControls);
    const PointerLockControls = await page.evaluate(() => window.PointerLockControls);

    console.log('\n🔍 全局變數檢查：');
    console.log(`  window.THREE: ${THREE ? '✅' : '❌'}`);
    console.log(`  window.OrbitControls: ${OrbitControls ? '✅' : '❌'}`);
    console.log(`  window.PointerLockControls: ${PointerLockControls ? '✅' : '❌'}`);

    // 檢查console錯誤
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg));

    // 取得Console錯誤信息
    console.log('\n📝 控制台訊息：');
    const messages = await page.evaluate(() => {
        return window.__consoleMessages || [];
    });

    // 截圖
    const screenshotPath = path.join(__dirname, 'browser-test-screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`\n📸 截圖已保存到: ${screenshotPath}`);

    // 檢查初始化狀態
    const isInitialized = await page.evaluate(() => window.scene && window.renderer && window.camera);
    console.log(`\n⚙️  初始化狀態: ${isInitialized ? '✅ 已初始化' : '❌ 未初始化'}`);

    // 測試模式切換
    console.log('\n🔄 測試模式切換...');
    try {
        await page.click('button:has-text("外部視角")');
        await page.waitForTimeout(500);
        console.log('✅ 外部視角模式切換成功');

        await page.click('button:has-text("內部導覽")');
        await page.waitForTimeout(500);
        console.log('✅ 內部導覽模式切換成功');

        await page.click('button:has-text("第一人稱")');
        await page.waitForTimeout(500);
        console.log('✅ 第一人稱模式切換成功');
    } catch (e) {
        console.log('❌ 模式切換失敗: ' + e.message);
    }

    // 最終截圖
    const finalScreenshotPath = path.join(__dirname, 'final-test-screenshot.png');
    await page.screenshot({ path: finalScreenshotPath });
    console.log(`\n📸 最終截圖已保存到: ${finalScreenshotPath}`);

    await browser.close();
    console.log('\n✅ 測試完成');
}

testRendering().catch(console.error);
