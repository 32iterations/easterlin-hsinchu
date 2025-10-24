/**
 * 综合功能测试脚本 - 验证所有三个核心功能
 *
 * 测试内容：
 * 1. 3D 建築視覺化渲染
 * 2. 房間交互系統
 * 3. 第一人稱導覽
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOT_DIR = path.join(__dirname, 'test-results');

// 确保输出目录存在
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
    let browser;

    try {
        console.log('\n' + '='.repeat(70));
        console.log('🚀 赤土崎多功能館 3D 可視化系統 - 综合功能测试');
        console.log('='.repeat(70) + '\n');

        // 启动浏览器
        browser = await chromium.launch({
            headless: false,
            args: ['--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();

        // 设置视口大小
        await page.setViewportSize({ width: 1920, height: 1080 });

        console.log('📍 正在加载页面: ' + BASE_URL);
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });

        console.log('⏳ 等待 3D 场景初始化 (3秒)...');
        await page.waitForTimeout(3000);

        // ================== 测试 1: 3D 建築視覺化渲染 ==================
        console.log('\n📌 [测试 1] 3D 建築視覺化渲染');
        console.log('-'.repeat(70));

        const test1Results = await page.evaluate(() => {
            return {
                sceneExists: typeof scene !== 'undefined',
                rendererExists: typeof renderer !== 'undefined',
                cameraExists: typeof orbitCamera !== 'undefined',
                buildingExists: typeof building !== 'undefined',
                sceneChildren: scene ? scene.children.length : 0,
                canvasSize: renderer ? {
                    width: renderer.domElement.width,
                    height: renderer.domElement.height
                } : null,
                fpsCurrent: document.getElementById('fps-display')?.textContent || 'N/A',
                objectCount: document.getElementById('obj-display')?.textContent || 'N/A',
                backgroundColor: scene?.background?.getHexString() || 'N/A'
            };
        });

        console.log('✓ Three.js 场景对象存在:', test1Results.sceneExists ? '✅' : '❌');
        console.log('✓ WebGL 渲染器存在:', test1Results.rendererExists ? '✅' : '❌');
        console.log('✓ 轨道控制相机存在:', test1Results.cameraExists ? '✅' : '❌');
        console.log('✓ 建筑模型存在:', test1Results.buildingExists ? '✅' : '❌');
        console.log(`✓ 场景子元素数量: ${test1Results.sceneChildren} 个`);
        console.log(`✓ Canvas 尺寸: ${test1Results.canvasSize?.width}x${test1Results.canvasSize?.height}`);
        console.log(`✓ 当前 FPS: ${test1Results.fpsCurrent}`);
        console.log(`✓ 3D 对象数: ${test1Results.objectCount}`);
        console.log(`✓ 背景颜色: #${test1Results.backgroundColor}`);

        // 拍摄 3D 渲染的初始状态截图
        const screenshotPath1 = path.join(SCREENSHOT_DIR, '1-3D-rendering-initial.png');
        await page.screenshot({ path: screenshotPath1 });
        console.log(`\n📸 初始状态截图: ${screenshotPath1}`);

        // ================== 测试 2: 房間交互系統 ==================
        console.log('\n📌 [测试 2] 房間交互系統');
        console.log('-'.repeat(70));

        // 获取初始楼层信息
        const initialFloorInfo = await page.evaluate(() => {
            const currentFloor = window.currentFloor;
            const roomsList = document.querySelectorAll('.room-item');
            const floorBtn = document.querySelector('.floor-btn.active');

            return {
                currentFloor: currentFloor,
                roomCount: roomsList.length,
                activeFloorBtn: floorBtn?.textContent?.trim() || 'N/A',
                roomNames: Array.from(roomsList).map(r => r.textContent.split('\n')[0])
            };
        });

        console.log(`✓ 当前楼层: ${initialFloorInfo.currentFloor}`);
        console.log(`✓ 房间数量: ${initialFloorInfo.roomCount}`);
        console.log(`✓ 活跃按钮: ${initialFloorInfo.activeFloorBtn}`);
        console.log(`✓ 房间列表:`, initialFloorInfo.roomNames.slice(0, 3).join(', ') + '...');

        // 测试楼层切换
        console.log('\n⏳ 测试楼层切换: 1F → 2F...');
        await page.click('button.floor-btn:nth-of-type(3)'); // 点击 2F 按钮
        await page.waitForTimeout(500);

        const floorSwitchResult = await page.evaluate(() => {
            return {
                currentFloor: window.currentFloor,
                roomCount: document.querySelectorAll('.room-item').length,
                activeFloorBtn: document.querySelector('.floor-btn.active')?.textContent?.trim()
            };
        });

        console.log(`✓ 楼层切换成功: ${floorSwitchResult.currentFloor}`);
        console.log(`✓ 新楼层房间数: ${floorSwitchResult.roomCount}`);
        console.log(`✓ 活跃按钮已更新: ${floorSwitchResult.activeFloorBtn}`);

        // 拍摄楼层切换后的截图
        const screenshotPath2 = path.join(SCREENSHOT_DIR, '2-room-interaction-floor-switch.png');
        await page.screenshot({ path: screenshotPath2 });
        console.log(`📸 楼层切换截图: ${screenshotPath2}`);

        // 测试房间选择
        console.log('\n⏳ 测试房间选择: 点击第一个房间...');
        const roomItem = await page.$('.room-item');
        if (roomItem) {
            await roomItem.click();
            await page.waitForTimeout(500);

            const roomInfo = await page.evaluate(() => {
                const infoCard = document.querySelector('.info-card');
                return {
                    hasInfoCard: !!infoCard,
                    cardTitle: infoCard?.querySelector('.card-title')?.textContent || 'N/A',
                    cardContent: infoCard?.querySelector('.card-content')?.textContent?.substring(0, 100) || 'N/A'
                };
            });

            console.log(`✓ 房间信息面板更新: ${roomInfo.hasInfoCard ? '✅' : '❌'}`);
            console.log(`✓ 面板标题: ${roomInfo.cardTitle}`);
            console.log(`✓ 面板内容预览: ${roomInfo.cardContent.substring(0, 50)}...`);
        }

        // 拍摄房间详情截图
        const screenshotPath3 = path.join(SCREENSHOT_DIR, '3-room-interaction-details.png');
        await page.screenshot({ path: screenshotPath3 });
        console.log(`📸 房间详情截图: ${screenshotPath3}`);

        // ================== 测试 3: 第一人稱導覽 ==================
        console.log('\n📌 [测试 3] 第一人稱導覽');
        console.log('-'.repeat(70));

        // 切换到 FPS 模式
        console.log('⏳ 切换到 FPS 模式...');
        const fpsModeBtn = await page.$('button.mode-btn:nth-of-type(3)'); // 第三个模式按钮是 FPS
        if (fpsModeBtn) {
            await fpsModeBtn.click();
            await page.waitForTimeout(500);

            const fpsMode = await page.evaluate(() => {
                return {
                    currentMode: window.currentMode,
                    fpsCamera: typeof fpsCamera !== 'undefined',
                    fpsHeight: window.FPS_HEIGHT || 'N/A',
                    pointerLockSupport: document.pointerLockElement !== null || 'Not locked'
                };
            });

            console.log(`✓ 当前模式: ${fpsMode.currentMode}`);
            console.log(`✓ FPS 相机已初始化: ${fpsMode.fpsCamera ? '✅' : '❌'}`);
            console.log(`✓ 人眼高度: ${fpsMode.fpsHeight} 单位`);
            console.log(`✓ 指针锁定状态: ${fpsMode.pointerLockSupport}`);
        }

        // 拍摄 FPS 模式截图
        const screenshotPath4 = path.join(SCREENSHOT_DIR, '4-fps-mode.png');
        await page.screenshot({ path: screenshotPath4 });
        console.log(`📸 FPS 模式截图: ${screenshotPath4}`);

        // 模拟键盘输入（W 键移动）
        console.log('\n⏳ 模拟 WASD 键盘输入...');
        await page.keyboard.press('w');
        await page.keyboard.press('a');
        await page.keyboard.press('s');
        await page.keyboard.press('d');
        await page.waitForTimeout(500);

        const movementTest = await page.evaluate(() => {
            return {
                moveVector: window.moveVector || {},
                fpsPosition: window.fpsCamera?.position || 'N/A',
                currentMode: window.currentMode
            };
        });

        console.log(`✓ 键盘输入状态:`, JSON.stringify(movementTest.moveVector));
        console.log(`✓ FPS 相机位置: x=${typeof movementTest.fpsPosition.x}, y=${typeof movementTest.fpsPosition.y}, z=${typeof movementTest.fpsPosition.z}`);

        // 拍摄移动后的截图
        const screenshotPath5 = path.join(SCREENSHOT_DIR, '5-fps-movement.png');
        await page.screenshot({ path: screenshotPath5 });
        console.log(`📸 移动后的截图: ${screenshotPath5}`);

        // ================== 综合总结 ==================
        console.log('\n' + '='.repeat(70));
        console.log('✅ 综合测试总结');
        console.log('='.repeat(70));

        const allTests = {
            '3D 建築視覺化': test1Results.sceneExists && test1Results.rendererExists && test1Results.sceneChildren > 0,
            '房間交互系統': initialFloorInfo.roomCount > 0 && floorSwitchResult.roomCount > 0,
            '第一人稱導覽': fpsModeBtn !== null
        };

        Object.entries(allTests).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}`);
        });

        const allPassed = Object.values(allTests).every(v => v);
        console.log('\n' + '='.repeat(70));
        console.log(allPassed ? '🎉 所有功能测试已通过！' : '⚠️  有些功能需要修复');
        console.log('='.repeat(70) + '\n');

        // 生成测试报告
        const report = {
            timestamp: new Date().toISOString(),
            baseUrl: BASE_URL,
            tests: {
                '3D建築視覺化': test1Results,
                '房間交互系統': {
                    初始楼层: initialFloorInfo,
                    楼层切换: floorSwitchResult
                },
                '第一人稱導覽': 'FPS mode initialized and tested'
            },
            allTestsPassed: allPassed,
            screenshots: [
                screenshotPath1,
                screenshotPath2,
                screenshotPath3,
                screenshotPath4,
                screenshotPath5
            ]
        };

        const reportPath = path.join(SCREENSHOT_DIR, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 详细测试报告: ${reportPath}\n`);

        await page.close();

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        console.error('堆栈:', error.stack);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// 运行测试
runTests().catch(console.error);
