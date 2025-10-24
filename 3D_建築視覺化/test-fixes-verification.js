const { chromium } = require('playwright');
const path = require('path');

async function testFixes() {
    console.log('🧪 開始測試場景初始化修復...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // 收集所有console消息
    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
        consoleMessages.push(msg.text());
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    page.on('pageerror', err => {
        errors.push('Page Error: ' + err.message);
    });

    try {
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(5000);

        // 檢查場景是否初始化
        const sceneDebugInfo = await page.evaluate(() => {
            if (!window.scene) return { error: 'Scene not exposed' };
            if (!window.renderer) return { error: 'Renderer not exposed' };
            if (!window.camera) return { error: 'Camera not exposed' };

            return {
                sceneChildCount: window.scene.children.length,
                cameraPosition: {
                    x: window.camera.position.x,
                    y: window.camera.position.y,
                    z: window.camera.position.z
                },
                rendererSize: {
                    width: window.renderer.domElement.width,
                    height: window.renderer.domElement.height
                },
                canvasVisible: window.renderer.domElement.offsetParent !== null,
                buildingGeometryCount: window.scene.children[4]?.children?.length || 0
            };
        });

        console.log('✅ 場景狀態:');
        console.log(JSON.stringify(sceneDebugInfo, null, 2));

        // 檢查是否有錯誤消息
        console.log('\n📋 控制台消息:');
        const errorLines = consoleMessages.filter(msg =>
            msg.includes('error') || msg.includes('undefined') || msg.includes('ERROR')
        );

        if (errorLines.length > 0) {
            console.log('⚠️  發現錯誤:');
            errorLines.forEach(line => console.log('  - ' + line));
        } else {
            console.log('✅ 無重要錯誤');
        }

        // 檢查是否有debugLog error
        const debugLogError = consoleMessages.find(msg => msg.includes('debugLog is not defined'));
        if (debugLogError) {
            console.log('❌ debugLog錯誤仍存在!');
        } else {
            console.log('✅ debugLog錯誤已修復');
        }

        // 檢查是否有undefined color錯誤
        const colorError = consoleMessages.find(msg => msg.includes('color') && msg.includes('undefined'));
        if (colorError) {
            console.log('❌ 顏色undefined錯誤仍存在!');
        } else {
            console.log('✅ 顏色undefined錯誤已修復');
        }

        // 截圖以視覺驗證
        await page.screenshot({ path: path.join(__dirname, 'test-fixes-screenshot.png') });
        console.log('\n📸 已保存截圖到 test-fixes-screenshot.png');

        // 測試導航功能
        console.log('\n🔀 測試模式切換...');
        const floorButtons = await page.$$('button[onclick*="selectFloor"]');
        console.log(`找到 ${floorButtons.length} 個樓層按鈕`);

        if (floorButtons.length > 0) {
            // 嘗試點擊第一個按鈕
            await floorButtons[0].click();
            await page.waitForTimeout(1000);
            console.log('✅ 成功點擊樓層按鈕');
        }

        console.log('\n✅ 所有測試完成!');

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
    } finally {
        await browser.close();
    }
}

testFixes().catch(console.error);
