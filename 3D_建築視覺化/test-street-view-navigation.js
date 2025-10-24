const { chromium } = require('playwright');
const path = require('path');

async function testStreetViewNavigation() {
    console.log('🧪 開始街景導航系統測試...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();

    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text()
        });
        console.log(`[${msg.type()}] ${msg.text()}`);
    });

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // 測試1: 驗證街景導航系統初始化
        console.log('\n✅ 測試1: 驗證街景導航系統');
        const navSystemReady = await page.evaluate(() => {
            return window.streetViewNav && {
                enabled: window.streetViewNav.enabled,
                hasWaypoints: window.streetViewNav.waypoints.length > 0,
                hasNavigationMarkers: window.streetViewNav.navigationMarkers.length > 0,
                isTransitioning: window.streetViewNav.isTransitioning
            };
        });
        console.log('街景導航系統狀態:', navSystemReady);

        // 測試2: 驗證enterRoom函數存在
        console.log('\n✅ 測試2: 驗證enterRoom函數存在');
        const enterRoomExists = await page.evaluate(() => {
            return typeof window.enterRoom === 'function' ||
                   typeof enterRoom !== 'undefined';  // 可能在全局作用域
        });
        console.log(`enterRoom函數存在: ${enterRoomExists}`);

        // 測試3: 驗證navigateToPoint函數存在
        console.log('\n✅ 測試3: 驗證navigateToPoint函數存在');
        const navigateToPointExists = await page.evaluate(() => {
            return typeof window.navigateToPoint === 'function' ||
                   typeof navigateToPoint !== 'undefined';
        });
        console.log(`navigateToPoint函數存在: ${navigateToPointExists}`);

        // 測試4: 嘗試在FPS模式下點擊
        console.log('\n✅ 測試4: 測試FPS模式點擊事件');

        // 先切換到FPS模式
        await page.evaluate(() => {
            window.currentMode = 'fps';
            console.log('已切換到FPS模式');
        });
        await page.waitForTimeout(500);

        // 檢查FPS模式是否激活
        const fpsModeActive = await page.evaluate(() => window.currentMode === 'fps');
        console.log(`FPS模式激活: ${fpsModeActive}`);

        // 測試5: 驗證點擊事件監聽器已添加
        console.log('\n✅ 測試5: 驗證點擊事件已配置');
        const clickHandlerConfigured = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            // 檢查是否有監聽器（這很難直接驗證，但我們可以檢查相關變量）
            return canvas && {
                canvasExists: true,
                hasRenderer: !!window.renderer,
                hasFpsCamera: !!window.fpsCamera,
                hasRaycaster: !!window.raycaster
            };
        });
        console.log('點擊處理系統配置:', clickHandlerConfigured);

        // 測試6: 模擬點擊並驗證處理
        console.log('\n✅ 測試6: 模擬畫布點擊');
        const transitionBefore = await page.evaluate(() => window.streetViewNav.isTransitioning);
        console.log(`點擊前轉移狀態: ${transitionBefore}`);

        // 點擊畫布中心
        const canvas = await page.$('canvas');
        if (canvas) {
            const boundingBox = await canvas.boundingBox();
            if (boundingBox) {
                const centerX = boundingBox.x + boundingBox.width / 2;
                const centerY = boundingBox.y + boundingBox.height / 2;

                console.log(`點擊位置: (${Math.floor(centerX)}, ${Math.floor(centerY)})`);
                await page.click('canvas', { position: { x: boundingBox.width / 2, y: boundingBox.height / 2 } });

                // 等待轉移動畫完成
                await page.waitForTimeout(2000);

                const transitionAfter = await page.evaluate(() => window.streetViewNav.isTransitioning);
                console.log(`點擊後轉移狀態: ${transitionAfter}`);
            }
        }

        // 測試7: 獲取當前相機位置
        console.log('\n✅ 測試7: 驗證相機位置變化');
        const cameraState = await page.evaluate(() => {
            if (window.fpsCamera) {
                return {
                    x: window.fpsCamera.position.x.toFixed(2),
                    y: window.fpsCamera.position.y.toFixed(2),
                    z: window.fpsCamera.position.z.toFixed(2)
                };
            }
            return null;
        });
        console.log('當前相機位置:', cameraState);

        // 測試8: 檢查控制台是否有錯誤
        console.log('\n✅ 測試8: 檢查控制台錯誤');
        const errors = consoleMessages.filter(m =>
            m.type === 'error' || (m.text.includes('error') && !m.text.includes('favicon'))
        );
        console.log(`發現${errors.length}個錯誤:`);
        if (errors.length > 0) {
            errors.slice(0, 5).forEach(e => console.log(`  - ${e.text}`));
        } else {
            console.log('  ✅ 無重要錯誤!');
        }

        // 保存截圖
        console.log('\n📸 保存測試截圖...');
        await page.screenshot({ path: path.join(__dirname, 'test-street-view-nav.png') });
        console.log('   ✅ 已保存到 test-street-view-nav.png');

        console.log('\n🎉 街景導航測試完成！\n');

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
    } finally {
        await browser.close();
    }
}

testStreetViewNavigation().catch(console.error);
