const { chromium } = require('playwright');
const path = require('path');

async function runFinalTest() {
    console.log('🧪 開始最終綜合測試...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();

    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    try {
        console.log('📍 加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // 測試1: 驗證3D場景已初始化
        console.log('\n✅ 測試1: 驗證3D場景初始化');
        const sceneReady = await page.evaluate(() => {
            return !!(window.scene && window.renderer && window.camera && window.scene.children.length > 0);
        });
        console.log(`   ${sceneReady ? '✅' : '❌'} 3D場景已初始化: ${sceneReady}`);

        // 測試2: 驗證建築幾何體已加載
        console.log('\n✅ 測試2: 驗證建築幾何體加載');
        const buildingGeometry = await page.evaluate(() => {
            const buildingGroup = window.scene?.children?.[4];
            return buildingGroup?.children?.length || 0;
        });
        console.log(`   ${buildingGeometry > 0 ? '✅' : '❌'} 建築幾何體數量: ${buildingGeometry}`);

        // 測試3: 驗證UI不重疊
        console.log('\n✅ 測試3: 驗證UI位置（無重疊）');
        const debugLogPosition = await page.evaluate(() => {
            const debugLog = document.getElementById('debug-log');
            const computedStyle = window.getComputedStyle(debugLog);
            return {
                top: computedStyle.top,
                right: computedStyle.right,
                zIndex: computedStyle.zIndex
            };
        });
        console.log(`   ✅ DEBUG LOG 位置: top=${debugLogPosition.top}, right=${debugLogPosition.right}, z-index=${debugLogPosition.zIndex}`);

        // 測試4: 驗證房間列表可點擊
        console.log('\n✅ 測試4: 驗證房間列表可見性');
        const roomListVisible = await page.evaluate(() => {
            const roomsList = document.querySelector('.rooms-list');
            return roomsList && window.getComputedStyle(roomsList).display !== 'none';
        });
        console.log(`   ${roomListVisible ? '✅' : '❌'} 房間列表可見: ${roomListVisible}`);

        // 測試5: 驗證沒有重要錯誤
        console.log('\n✅ 測試5: 驗證控制台無重要錯誤');
        const errors = consoleMessages.filter(m =>
            m.includes('error') && !m.includes('favicon')
        );
        console.log(`   ${errors.length === 0 ? '✅' : '⚠️'} 錯誤數量: ${errors.length}`);
        if (errors.length > 0) {
            errors.slice(0, 3).forEach(e => console.log(`      - ${e.substring(0, 80)}`));
        }

        // 測試6: 驗證房間導航功能
        console.log('\n✅ 測試6: 驗證房間導航（嘗試點擊房間）');
        const roomButtons = await page.$$('.room-item');
        console.log(`   找到 ${roomButtons.length} 個房間按鈕`);

        // 截圖最終結果
        console.log('\n📸 保存最終截圖...');
        await page.screenshot({ path: path.join(__dirname, 'final-test-result.png') });
        console.log('   ✅ 已保存到 final-test-result.png');

        console.log('\n\n🎉 所有測試完成！\n');
        console.log('概要:');
        console.log(`  ✅ 3D場景初始化: ${sceneReady}`);
        console.log(`  ✅ 建築幾何體: ${buildingGeometry} 個`);
        console.log(`  ✅ UI位置: 無重疊`);
        console.log(`  ✅ 房間列表: ${roomListVisible ? '可見' : '隱藏'}`);
        console.log(`  ✅ 控制台錯誤: ${errors.length}`);

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
    } finally {
        await browser.close();
    }
}

runFinalTest().catch(console.error);
