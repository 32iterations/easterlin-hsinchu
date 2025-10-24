/**
 * 真实交互测试 - 用 Playwright 模拟用户操作
 * 测试楼层按钮点击、房间列表更新等实际功能
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';

async function runInteractiveTest() {
    let browser;

    try {
        console.log('\n' + '='.repeat(80));
        console.log('🎮 赤土崎多功能館 - 真实交互功能测试');
        console.log('='.repeat(80) + '\n');

        // 启动浏览器
        browser = await chromium.launch({
            headless: false,
            args: ['--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();

        // 监听 console 消息
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('🔴 [Console Error]:', msg.text());
            } else if (msg.type() === 'log') {
                console.log('📝 [Console Log]:', msg.text());
            }
        });

        // 监听页面错误
        page.on('pageerror', error => {
            console.log('❌ [Page Error]:', error.message);
        });

        await page.setViewportSize({ width: 1920, height: 1080 });

        console.log('📍 加载页面: ' + BASE_URL);
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });

        console.log('⏳ 等待页面完全加载 (3秒)...');
        await page.waitForTimeout(3000);

        // ================== 测试 1: 检查初始状态 ==================
        console.log('\n📌 [测试 1] 检查初始状态');
        console.log('-'.repeat(80));

        const initialState = await page.evaluate(() => {
            return {
                hasSelectFloor: typeof window.selectFloor !== 'undefined',
                hasCurrentFloor: typeof window.currentFloor !== 'undefined',
                hasRoomData: typeof window.ROOM_DATA !== 'undefined',
                currentFloorValue: window.currentFloor,
                roomsListHTML: document.getElementById('rooms-list')?.innerHTML?.length || 0,
                activeButton: document.querySelector('.floor-btn.active')?.textContent?.trim()
            };
        });

        console.log('✓ selectFloor 函数存在:', initialState.hasSelectFloor ? '✅' : '❌');
        console.log('✓ currentFloor 变量存在:', initialState.hasCurrentFloor ? '✅' : '❌');
        console.log('✓ ROOM_DATA 存在:', initialState.hasRoomData ? '✅' : '❌');
        console.log('✓ 当前楼层:', initialState.currentFloorValue);
        console.log('✓ 房间列表 HTML 长度:', initialState.roomsListHTML);
        console.log('✓ 活跃按钮:', initialState.activeButton);

        // 拍摄初始状态
        await page.screenshot({ path: 'test-results/test-initial-state.png' });
        console.log('📸 初始状态截图: test-results/test-initial-state.png');

        // ================== 测试 2: 点击楼层按钮 ==================
        console.log('\n📌 [测试 2] 点击楼层按钮 (1F → 2F)');
        console.log('-'.repeat(80));

        // 获取所有楼层按钮
        const floorButtons = await page.locator('.floor-btn').all();
        console.log(`找到 ${floorButtons.length} 个楼层按钮`);

        // 点击第三个按钮 (2F)
        if (floorButtons.length >= 3) {
            const button2F = floorButtons[2];
            const buttonText = await button2F.textContent();
            console.log(`⏳ 点击按钮: "${buttonText}"`);

            // 点击按钮前的房间列表
            const beforeClick = await page.evaluate(() => {
                return document.getElementById('rooms-list')?.innerHTML || '';
            });
            console.log(`点击前房间列表长度: ${beforeClick.length}`);

            // 执行点击
            await button2F.click();

            // 等待可能的 DOM 更新
            console.log('⏳ 等待 DOM 更新 (1秒)...');
            await page.waitForTimeout(1000);

            // 点击后的房间列表
            const afterClick = await page.evaluate(() => {
                return {
                    currentFloor: window.currentFloor,
                    roomsListHTML: document.getElementById('rooms-list')?.innerHTML || '',
                    activeButton: document.querySelector('.floor-btn.active')?.textContent?.trim(),
                    roomCount: document.querySelectorAll('.room-item').length
                };
            });

            console.log(`✓ 点击后楼层: ${afterClick.currentFloor}`);
            console.log(`✓ 房间列表 HTML 长度: ${afterClick.roomsListHTML.length}`);
            console.log(`✓ 活跃按钮: ${afterClick.activeButton}`);
            console.log(`✓ 房间项数量: ${afterClick.roomCount}`);

            // 比较变化
            if (beforeClick !== afterClick.roomsListHTML) {
                console.log('✅ 房间列表已更新 (内容不同)');
            } else {
                console.log('❌ 房间列表未更新 (内容相同)');
            }

            if (afterClick.currentFloor === '2F') {
                console.log('✅ currentFloor 变量已更新为 2F');
            } else {
                console.log('❌ currentFloor 变量未更新');
            }

            // 拍摄点击后的状态
            await page.screenshot({ path: 'test-results/test-after-click-2F.png' });
            console.log('📸 点击后截图: test-results/test-after-click-2F.png');
        }

        // ================== 测试 3: 点击房间项 ==================
        console.log('\n📌 [测试 3] 点击房间项查看详情');
        console.log('-'.repeat(80));

        const roomItems = await page.locator('.room-item').all();
        console.log(`找到 ${roomItems.length} 个房间项`);

        if (roomItems.length > 0) {
            const firstRoom = roomItems[0];
            const roomText = await firstRoom.textContent();
            console.log(`⏳ 点击房间: "${roomText.substring(0, 50)}..."`);

            // 点击前的信息面板
            const beforeRoomClick = await page.evaluate(() => {
                return document.querySelector('.info-card')?.textContent || '';
            });

            // 点击房间
            await firstRoom.click();

            console.log('⏳ 等待信息面板更新 (500ms)...');
            await page.waitForTimeout(500);

            // 点击后的信息面板
            const afterRoomClick = await page.evaluate(() => {
                return {
                    infoCardText: document.querySelector('.info-card')?.textContent || '',
                    cardTitle: document.querySelector('.card-title')?.textContent || ''
                };
            });

            console.log(`✓ 信息面板标题: ${afterRoomClick.cardTitle}`);

            if (beforeRoomClick !== afterRoomClick.infoCardText) {
                console.log('✅ 信息面板已更新');
            } else {
                console.log('⚠️ 信息面板可能未更新');
            }

            // 拍摄房间详情
            await page.screenshot({ path: 'test-results/test-room-details.png' });
            console.log('📸 房间详情截图: test-results/test-room-details.png');
        }

        // ================== 测试 4: 测试其他视角模式 ==================
        console.log('\n📌 [测试 4] 测试视角模式切换');
        console.log('-'.repeat(80));

        const modeButtons = await page.locator('.mode-btn').all();
        console.log(`找到 ${modeButtons.length} 个视角模式按钮`);

        if (modeButtons.length >= 3) {
            // 点击第二个按钮 (内部导览)
            const button2 = modeButtons[1];
            const modeText = await button2.textContent();
            console.log(`⏳ 切换到模式: "${modeText}"`);
            await button2.click();
            await page.waitForTimeout(500);

            const mode2Result = await page.evaluate(() => {
                return {
                    currentMode: window.currentMode,
                    activeButton: document.querySelector('.mode-btn.active')?.textContent?.trim()
                };
            });
            console.log(`✓ 当前模式: ${mode2Result.currentMode}`);
            console.log(`✓ 活跃按钮: ${mode2Result.activeButton}`);

            // 点击第三个按钮 (FPS)
            const button3 = modeButtons[2];
            const fpsModeText = await button3.textContent();
            console.log(`⏳ 切换到模式: "${fpsModeText}"`);
            await button3.click();
            await page.waitForTimeout(500);

            const fpsResult = await page.evaluate(() => {
                return {
                    currentMode: window.currentMode,
                    fpsCamera: typeof window.fpsCamera !== 'undefined',
                    activeButton: document.querySelector('.mode-btn.active')?.textContent?.trim()
                };
            });
            console.log(`✓ 当前模式: ${fpsResult.currentMode}`);
            console.log(`✓ FPS 相机存在: ${fpsResult.fpsCamera ? '✅' : '❌'}`);
            console.log(`✓ 活跃按钮: ${fpsResult.activeButton}`);

            // 拍摄 FPS 模式
            await page.screenshot({ path: 'test-results/test-fps-mode-click.png' });
            console.log('📸 FPS 模式截图: test-results/test-fps-mode-click.png');
        }

        // ================== 测试 5: 测试控制面板按钮 ==================
        console.log('\n📌 [测试 5] 测试控制面板按钮');
        console.log('-'.repeat(80));

        const ctrlButtons = await page.locator('.ctrl-btn').all();
        console.log(`找到 ${ctrlButtons.length} 个控制面板按钮`);

        if (ctrlButtons.length > 0) {
            // 测试线框切换
            const wireframeBtn = ctrlButtons[0];
            const btnText = await wireframeBtn.textContent();
            console.log(`⏳ 点击按钮: "${btnText}"`);
            await wireframeBtn.click();
            await page.waitForTimeout(300);
            console.log('✅ 线框按钮可点击');

            // 拍摄点击后
            await page.screenshot({ path: 'test-results/test-controls.png' });
            console.log('📸 控制面板截图: test-results/test-controls.png');
        }

        // ================== 总结 ==================
        console.log('\n' + '='.repeat(80));
        console.log('✅ 交互测试完成');
        console.log('='.repeat(80));
        console.log('\n生成的截图:');
        console.log('  - test-results/test-initial-state.png (初始状态)');
        console.log('  - test-results/test-after-click-2F.png (点击楼层后)');
        console.log('  - test-results/test-room-details.png (房间详情)');
        console.log('  - test-results/test-fps-mode-click.png (FPS 模式)');
        console.log('  - test-results/test-controls.png (控制面板)');
        console.log('\n');

        // 生成总结报告
        const report = {
            timestamp: new Date().toISOString(),
            baseUrl: BASE_URL,
            tests: {
                initialState: initialState,
                interactiveTests: {
                    floorButtonClick: '已执行',
                    roomItemClick: '已执行',
                    modeButtonClick: '已执行',
                    controlPanelClick: '已执行'
                }
            }
        };

        const reportPath = path.join('test-results', 'interactive-test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 详细报告: ${reportPath}\n`);

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
runInteractiveTest().catch(console.error);
