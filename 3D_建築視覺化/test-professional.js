const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // 捕獲所有控制台消息
    page.on('console', msg => {
        console.log(`[${msg.type()}] ${msg.text()}`);
    });

    // 捕獲頁面錯誤
    page.on('pageerror', err => {
        console.error(`[錯誤] ${err.message}`);
    });

    // 捕獲網絡請求
    page.on('response', response => {
        if (response.url().includes('/libs/three/') || response.url().includes('localhost:8080')) {
            console.log(`[${response.status()}] ${response.url()}`);
        }
    });

    try {
        console.log('📍 訪問專業版本...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

        console.log('\n⏳ 等待頁面初始化...');
        await page.waitForTimeout(3000);

        console.log('\n🔍 檢查 Three.js 是否加載...');
        const threeLoaded = await page.evaluate(() => typeof THREE !== 'undefined');
        console.log(`THREE 物件: ${threeLoaded ? '✅ 已加載' : '❌ 未加載'}`);

        console.log('\n🔍 檢查 OrbitControls 是否加載...');
        const orbitLoaded = await page.evaluate(() => typeof window.OrbitControls !== 'undefined');
        console.log(`OrbitControls: ${orbitLoaded ? '✅ 已加載' : '❌ 未加載'}`);

        console.log('\n🔍 檢查 PointerLockControls 是否加載...');
        const pointerLoaded = await page.evaluate(() => typeof window.PointerLockControls !== 'undefined');
        console.log(`PointerLockControls: ${pointerLoaded ? '✅ 已加載' : '❌ 未加載'}`);

        console.log('\n🔍 檢查場景是否初始化...');
        const sceneInfo = await page.evaluate(() => {
            if (typeof scene !== 'undefined') {
                return {
                    childrenCount: scene.children.length,
                    hasRenderer: typeof renderer !== 'undefined',
                    hasCamera: typeof orbitCamera !== 'undefined',
                };
            }
            return null;
        });

        if (sceneInfo) {
            console.log(`✅ 場景已初始化`);
            console.log(`   - 子元素: ${sceneInfo.childrenCount}`);
            console.log(`   - 渲染器: ${sceneInfo.hasRenderer ? '✅' : '❌'}`);
            console.log(`   - 相機: ${sceneInfo.hasCamera ? '✅' : '❌'}`);
        } else {
            console.log('❌ 場景未初始化');
        }

        console.log('\n🔍 檢查 Canvas 狀態...');
        const canvasInfo = await page.evaluate(() => {
            const canvas = document.getElementById('canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                return {
                    exists: true,
                    width: canvas.width,
                    height: canvas.height,
                    displayWidth: rect.width,
                    displayHeight: rect.height,
                    context: canvas.getContext('webgl2') ? 'WebGL2' : (canvas.getContext('webgl') ? 'WebGL' : '2D'),
                };
            }
            return { exists: false };
        });

        if (canvasInfo.exists) {
            console.log(`✅ Canvas 存在`);
            console.log(`   - 尺寸: ${canvasInfo.width}x${canvasInfo.height}`);
            console.log(`   - 顯示尺寸: ${canvasInfo.displayWidth}x${canvasInfo.displayHeight}`);
            console.log(`   - 上下文: ${canvasInfo.context}`);
        } else {
            console.log('❌ Canvas 不存在');
        }

        console.log('\n📊 完整初始化狀態:');
        const status = await page.evaluate(() => {
            return {
                THREE: typeof THREE !== 'undefined',
                scene: typeof scene !== 'undefined',
                renderer: typeof renderer !== 'undefined',
                orbitCamera: typeof orbitCamera !== 'undefined',
                orbitControls: typeof orbitControls !== 'undefined',
                fpsCam: typeof fpsCam !== 'undefined',
                pageVisible: document.visibilityState === 'visible',
                canvasSize: {
                    width: document.getElementById('canvas')?.width || 0,
                    height: document.getElementById('canvas')?.height || 0,
                }
            };
        });

        console.log(JSON.stringify(status, null, 2));

    } catch (error) {
        console.error('❌ 測試失敗:', error.message);
    } finally {
        await page.screenshot({ path: 'test-screenshot.png' });
        console.log('\n📸 已保存截圖: test-screenshot.png');
        await browser.close();
    }
})();
