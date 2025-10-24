const { chromium } = require('playwright');
const path = require('path');

async function testFPSFloorSwitchBug() {
    console.log('🎯 測試 FPS 樓層切換房間導航 BUG...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 150 });
    const page = await browser.newPage();

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // =========== 步驟1: 切換到 FPS 模式 ===========
        console.log('\n✅ 步驟1: 切換到第一人稱(FPS)模式');
        await page.evaluate(() => {
            window.switchMode('fps');
        });
        await page.waitForTimeout(2000);

        // =========== 步驟2: 檢查初始樓層 ===========
        console.log('\n✅ 步驟2: 檢查初始樓層');
        const initialFloorInfo = await page.evaluate(() => {
            return {
                currentFloor: window.currentFloor,
                floorCount: Object.keys(window.ROOM_DATA || {}).length,
                availableFloors: Object.keys(window.ROOM_DATA || {})
            };
        });
        console.log('   • 當前樓層: ' + initialFloorInfo.currentFloor);
        console.log('   • 樓層總數: ' + initialFloorInfo.floorCount);
        console.log('   • 可用樓層: ' + initialFloorInfo.availableFloors.join(', '));

        // =========== 步驟3: 在初始樓層點擊房間 ===========
        console.log('\n✅ 步驟3: 在初始樓層(' + initialFloorInfo.currentFloor + ')點擊房間');
        const beforeFirstClick = await page.evaluate(() => {
            return {
                cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                cameraZ: window.fpsCamera?.position?.z?.toFixed(2)
            };
        });
        console.log('   點擊前相機位置: (' + beforeFirstClick.cameraX + ', ' + beforeFirstClick.cameraY + ', ' + beforeFirstClick.cameraZ + ')');

        // 點擊第一個房間
        const roomButtons = await page.$$('.room-item');
        if (roomButtons.length > 0) {
            const firstRoom = await page.evaluate(() => {
                return document.querySelector('.room-item')?.querySelector('.room-name')?.textContent?.trim();
            });
            console.log('   正在點擊房間: ' + firstRoom);
            await roomButtons[0].click();
            await page.waitForTimeout(3000);

            const afterFirstClick = await page.evaluate(() => {
                return {
                    currentRoom: window.streetViewNav?.currentRoom?.name,
                    cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                    cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                    cameraZ: window.fpsCamera?.position?.z?.toFixed(2),
                    sceneObjectCount: window.scene?.children?.length || 0
                };
            });
            console.log('   點擊後相機位置: (' + afterFirstClick.cameraX + ', ' + afterFirstClick.cameraY + ', ' + afterFirstClick.cameraZ + ')');
            console.log('   當前房間: ' + afterFirstClick.currentRoom);
            console.log('   場景物體數: ' + afterFirstClick.sceneObjectCount);

            if (afterFirstClick.currentRoom === firstRoom) {
                console.log('   ✓ 初始樓層房間導航成功');
            } else {
                console.log('   ✗ 初始樓層房間導航失敗');
            }
        }

        // =========== 步驟4: 切換到不同樓層 ===========
        console.log('\n✅ 步驟4: 切換樓層');
        // 確保切換到不同的樓層
        const targetFloor = initialFloorInfo.currentFloor === '1F' ? '2F' : (initialFloorInfo.availableFloors.length > 1 ? initialFloorInfo.availableFloors[1] : '2F');
        if (targetFloor === initialFloorInfo.currentFloor) {
            console.log('   ⚠️ 警告: 目標樓層與當前樓層相同，跳過此測試');
        } else {
            console.log('   正在切換到: ' + targetFloor);

            await page.evaluate((floor) => {
                window.selectFloor(floor);
            }, targetFloor);
            await page.waitForTimeout(2500);
        }

        // 只有樓層變更才繼續測試
        if (targetFloor !== initialFloorInfo.currentFloor) {
            // =========== 步驟5: 檢查樓層切換後的狀態 ===========
            console.log('\n✅ 步驟5: 檢查樓層切換後的狀態');
            const afterFloorSwitch = await page.evaluate(() => {
                return {
                    currentFloor: window.currentFloor,
                    roomCount: (window.ROOM_DATA[window.currentFloor] || []).length,
                    cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                    cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                    cameraZ: window.fpsCamera?.position?.z?.toFixed(2),
                    sceneObjectCount: window.scene?.children?.length || 0,
                    currentRoom: window.streetViewNav?.currentRoom?.name || '無'
                };
            });
            console.log('   • 當前樓層: ' + afterFloorSwitch.currentFloor);
            console.log('   • 房間數: ' + afterFloorSwitch.roomCount);
            console.log('   • 相機位置: (' + afterFloorSwitch.cameraX + ', ' + afterFloorSwitch.cameraY + ', ' + afterFloorSwitch.cameraZ + ')');
            console.log('   • 場景物體數: ' + afterFloorSwitch.sceneObjectCount);
            console.log('   • 當前房間: ' + afterFloorSwitch.currentRoom);

            // =========== 步驟6: 在新樓層點擊房間（THIS IS THE CRITICAL TEST）===========
            console.log('\n✅ 步驟6: 在新樓層(' + targetFloor + ')點擊房間 【關鍵測試】');

            // 獲取新樓層的房間列表
            const newFloorRooms = await page.evaluate(() => {
                const items = document.querySelectorAll('#fps-rooms-list .room-item');
                return Array.from(items).slice(0, 1).map(item => ({
                    name: item.querySelector('.room-name')?.textContent?.trim(),
                    elementExists: !!item
                }));
            });

            if (newFloorRooms.length > 0) {
                const targetRoom = newFloorRooms[0];
                console.log('   正在點擊房間: ' + targetRoom.name);

                // 獲取新的房間按鈕並點擊
                const newRoomButtons = await page.$$('#fps-rooms-list .room-item');
                if (newRoomButtons.length > 0) {
                    const beforeSecondClick = await page.evaluate(() => {
                        return {
                            cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                            cameraZ: window.fpsCamera?.position?.z?.toFixed(2),
                            sceneObjectCount: window.scene?.children?.length || 0
                        };
                    });
                    console.log('   點擊前: 相機位置=(' + beforeSecondClick.cameraX + ', ' + beforeSecondClick.cameraZ + '), 場景物體=' + beforeSecondClick.sceneObjectCount);

                    await newRoomButtons[0].click();
                    await page.waitForTimeout(3000);

                    const afterSecondClick = await page.evaluate(() => {
                        return {
                            cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                            cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                            cameraZ: window.fpsCamera?.position?.z?.toFixed(2),
                            currentRoom: window.streetViewNav?.currentRoom?.name,
                            sceneObjectCount: window.scene?.children?.length || 0,
                            renderError: window.lastRenderError || '無'
                        };
                    });

                    console.log('   點擊後: 相機位置=(' + afterSecondClick.cameraX + ', ' + afterSecondClick.cameraY + ', ' + afterSecondClick.cameraZ + ')');
                    console.log('   當前房間: ' + afterSecondClick.currentRoom);
                    console.log('   場景物體數: ' + afterSecondClick.sceneObjectCount);
                    console.log('   渲染錯誤: ' + afterSecondClick.renderError);

                    // 檢查是否成功
                    const navigationSuccess = afterSecondClick.currentRoom === targetRoom.name;
                    const cameraMoved = afterSecondClick.cameraX !== beforeSecondClick.cameraX || afterSecondClick.cameraZ !== beforeSecondClick.cameraZ;
                    const noVisualGlitches = afterSecondClick.sceneObjectCount > 0 && afterSecondClick.renderError === '無';

                    console.log('\n   📊 導航結果:');
                    console.log('   • 房間切換成功: ' + (navigationSuccess ? '✓ 是' : '✗ 否'));
                    console.log('   • 相機位置改變: ' + (cameraMoved ? '✓ 是' : '✗ 否'));
                    console.log('   • 沒有視覺故障: ' + (noVisualGlitches ? '✓ 是' : '✗ 否'));

                    if (!navigationSuccess || !cameraMoved) {
                        console.log('\n   ❌ 【BUG 確認】樓層切換後房間導航失敗！');
                    } else if (!noVisualGlitches) {
                        console.log('\n   ❌ 【BUG 確認】視覺故障出現！');
                    } else {
                        console.log('\n   ✓ 樓層切換後房間導航正常');
                    }
                } else {
                    console.log('   ⚠️ 新樓層房間按鈕未找到');
                }
            } else {
                console.log('   ⚠️ 新樓層沒有房間');
            }
        }

        // =========== 步驟7: 保存截圖用於視覺檢查 ===========
        console.log('\n📸 保存測試截圖...');
        await page.screenshot({ path: path.join(__dirname, 'test-fps-floor-switch-bug.png') });
        console.log('   ✅ 已保存到 test-fps-floor-switch-bug.png');

        // =========== 最終報告 ===========
        console.log('\n' + '='.repeat(70));
        console.log('🎯 FPS 樓層切換房間導航測試完成');
        console.log('='.repeat(70));

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

testFPSFloorSwitchBug().catch(console.error);
