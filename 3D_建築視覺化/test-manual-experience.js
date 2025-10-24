const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8080';

async function manualExperience() {
    let browser;
    try {
        console.log('🎮 開啟瀏覽器進行手動體驗...\n');

        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        // 加載頁面
        console.log('📍 加載頁面，30秒內請自己測試：');
        console.log('1. 先切換到「內部導覽」模式');
        console.log('2. 按住滑鼠在畫面上移動（左右上下看）');
        console.log('3. 按 W/A/S/D 鍵移動');
        console.log('4. 試試切換到「第一人稱」模式');
        console.log('5. 重複上面的操作\n');

        await page.goto(BASE_URL, { waitUntil: 'networkidle' });

        // 等待 30 秒讓用戶體驗
        await page.waitForTimeout(30000);

        // 收集最終狀態
        const finalState = await page.evaluate(() => ({
            mode: window.currentMode,
            floor: window.currentFloor,
            cameraPos: {
                x: window.fpsCamera?.position.x.toFixed(2),
                y: window.fpsCamera?.position.y.toFixed(2),
                z: window.fpsCamera?.position.z.toFixed(2)
            },
            rotation: {
                pitch: window.minecraftControls?.pitch.toFixed(3),
                yaw: window.minecraftControls?.yaw.toFixed(3)
            }
        }));

        console.log('✅ 體驗結束！最終狀態：');
        console.log(`📍 當前模式: ${finalState.mode}`);
        console.log(`📍 當前樓層: ${finalState.floor}`);
        console.log(`📍 相機位置: (${finalState.cameraPos.x}, ${finalState.cameraPos.y}, ${finalState.cameraPos.z})`);
        console.log(`📍 相機旋轉: pitch=${finalState.rotation.pitch}, yaw=${finalState.rotation.yaw}`);

        await page.screenshot({ path: 'test-results/manual-experience-final.png' });
        console.log('\n📸 最終截圖: test-results/manual-experience-final.png');

    } catch (error) {
        console.error('❌ 體驗失敗:', error.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
    }
}

manualExperience().catch(console.error);
