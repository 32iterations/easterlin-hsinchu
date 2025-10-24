const { chromium } = require('playwright');
const path = require('path');

async function testStage4() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🌐 打開網站...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });

    // 等待模組加載
    console.log('⏳ 等待 Stage 4 家具加載...');
    await page.waitForSelector('#debug-log', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // 檢查調試日誌
    const debugLog = await page.textContent('#debug-log');
    console.log('\n📋 調試日誌片段：');
    console.log(debugLog.substring(0, 500));

    // 測試各樓層
    console.log('\n🔄 測試各樓層家具渲染...');
    const modes = ['外部視角', '內部導覽', '第一人稱'];
    
    for (const mode of modes) {
        console.log(`\n  ▶ 測試 "${mode}" 模式...`);
        try {
            await page.click(`button:has-text("${mode}")`);
            await page.waitForTimeout(500);
            console.log(`  ✅ "${mode}" 模式切換成功`);
        } catch (e) {
            console.log(`  ❌ "${mode}" 模式切換失敗: ${e.message}`);
        }
    }

    // 檢查 3D 物件數量
    const sceneObjectCount = await page.evaluate(() => {
        if (!window.scene) return 0;
        let count = 0;
        window.scene.traverse(obj => {
            if (obj.isMesh) count++;
        });
        return count;
    });
    console.log(`\n🎨 3D 物件總數: ${sceneObjectCount}`);

    // 取得大廳的地板信息
    const roomStats = await page.evaluate(() => {
        if (!window.scene) return {};
        const stats = {};
        let furnitureCount = 0;
        window.scene.traverse(obj => {
            if (obj.userData && obj.userData.floor) {
                if (!stats[obj.userData.floor]) {
                    stats[obj.userData.floor] = { walls: 0, furniture: 0 };
                }
                if (obj.userData.type === 'floor' || obj.userData.type === 'ceiling') {
                    // 這是樓層結構
                } else {
                    stats[obj.userData.floor].furniture++;
                }
            }
        });
        return stats;
    });
    console.log('\n📊 樓層家具統計:');
    console.log(JSON.stringify(roomStats, null, 2));

    // 截圖
    const screenshotPath = path.join(__dirname, 'stage4-test-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`\n📸 截圖已保存到: ${screenshotPath}`);

    await browser.close();
    console.log('\n✅ Stage 4 測試完成');
}

testStage4().catch(console.error);
