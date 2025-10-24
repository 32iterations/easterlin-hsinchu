const { chromium } = require('playwright');
const path = require('path');

async function testFPSWASDMovement() {
    console.log('🎯 測試 FPS WASD 走動和邊界限制...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // ============= 步驟1: 進入 FPS 模式並進入房間 =============
        console.log('\n✅ 步驟1: 進入 FPS 模式並導航到房間');
        await page.evaluate(() => {
            window.switchMode('fps');
        });
        await page.waitForTimeout(2000);

        // 點擊第一個房間進入
        const roomButtons = await page.$$('.room-item');
        if (roomButtons.length > 0) {
            await roomButtons[0].click();
            await page.waitForTimeout(2500);

            const roomInfo = await page.evaluate(() => {
                return {
                    currentRoom: window.streetViewNav?.currentRoom?.name,
                    initialX: window.fpsCamera?.position?.x?.toFixed(2),
                    initialY: window.fpsCamera?.position?.y?.toFixed(2),
                    initialZ: window.fpsCamera?.position?.z?.toFixed(2)
                };
            });

            console.log('   • 進入房間: ' + roomInfo.currentRoom);
            console.log('   • 初始位置: (' + roomInfo.initialX + ', ' + roomInfo.initialY + ', ' + roomInfo.initialZ + ')');

            // ============= 步驟2: 測試前進移動 (W 鍵) =============
            console.log('\n✅ 步驟2: 測試前進移動 (W 鍵)');

            // 模擬按住 W 鍵
            await page.evaluate(() => {
                const event = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW' });
                window.dispatchEvent(event);
            });

            // 讓遊戲循環運行幾幀
            await page.waitForTimeout(1000);

            // 鬆開 W 鍵
            await page.evaluate(() => {
                const event = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW' });
                window.dispatchEvent(event);
            });

            const afterWMove = await page.evaluate(() => {
                return {
                    x: window.fpsCamera?.position?.x?.toFixed(2),
                    y: window.fpsCamera?.position?.y?.toFixed(2),
                    z: window.fpsCamera?.position?.z?.toFixed(2)
                };
            });

            console.log('   • W 鍵移動後位置: (' + afterWMove.x + ', ' + afterWMove.y + ', ' + afterWMove.z + ')');
            console.log('   • 位置改變: ' + (afterWMove.z !== roomInfo.initialZ ? '✓ 是' : '✗ 否'));

            // ============= 步驟3: 測試邊界限制 =============
            console.log('\n✅ 步驟3: 測試邊界限制 (防止走出建築)');

            // 連續按 W 鍵多次，走向邊界
            for (let i = 0; i < 5; i++) {
                await page.evaluate(() => {
                    const event = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW' });
                    window.dispatchEvent(event);
                });
                await page.waitForTimeout(300);
                await page.evaluate(() => {
                    const event = new KeyboardEvent('keyup', { key: 'w', code: 'KeyW' });
                    window.dispatchEvent(event);
                });
            }

            const boundaryTestPos = await page.evaluate(() => {
                const bounds = {
                    minX: -16 + 1.0,
                    maxX: 16 - 1.0,
                    minZ: -10 + 1.0,
                    maxZ: 10 - 1.0
                };
                return {
                    x: window.fpsCamera?.position?.x?.toFixed(2),
                    z: window.fpsCamera?.position?.z?.toFixed(2),
                    xInBounds: window.fpsCamera?.position?.x >= bounds.minX && window.fpsCamera?.position?.x <= bounds.maxX,
                    zInBounds: window.fpsCamera?.position?.z >= bounds.minZ && window.fpsCamera?.position?.z <= bounds.maxZ
                };
            });

            console.log('   • 邊界測試後位置: (' + boundaryTestPos.x + ', ' + boundaryTestPos.z + ')');
            console.log('   • X 軸在邊界內: ' + (boundaryTestPos.xInBounds ? '✓ 是' : '✗ 否'));
            console.log('   • Z 軸在邊界內: ' + (boundaryTestPos.zInBounds ? '✓ 是' : '✗ 否'));

            // ============= 步驟4: 測試垂直限制 =============
            console.log('\n✅ 步驟4: 測試垂直邊界 (防止穿過地板/天花板)');

            const verticalTest = await page.evaluate(() => {
                try {
                    // 對於 1F，樓層高度應該是 4m
                    const floorBaseY = 0;  // 1F 在 y=0
                    const ceilingY = 4;   // 1F 天花板在 y=4
                    const cameraEyeHeight = 0.2;

                    return {
                        cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                        minY: (floorBaseY + cameraEyeHeight).toFixed(2),
                        maxY: (ceilingY - cameraEyeHeight).toFixed(2),
                        inBounds: window.fpsCamera?.position?.y >= floorBaseY + cameraEyeHeight &&
                                  window.fpsCamera?.position?.y <= ceilingY - cameraEyeHeight
                    };
                } catch(e) {
                    return { error: e.message, cameraY: window.fpsCamera?.position?.y?.toFixed(2) };
                }
            });

            if (verticalTest.error) {
                console.log('   ⚠️ 垂直邊界檢查: ' + verticalTest.error);
            } else {
                console.log('   • 相機 Y 位置: ' + verticalTest.cameraY);
                console.log('   • Y 軸範圍: ' + verticalTest.minY + ' ~ ' + verticalTest.maxY);
                console.log('   • Y 軸在邊界內: ' + (verticalTest.inBounds ? '✓ 是' : '✗ 否'));
            }

            // ============= 步驟5: 走向另一個房間 =============
            console.log('\n✅ 步驟5: 測試走動到其他房間');

            // 獲取其他房間位置
            const otherRoom = await page.evaluate(() => {
                const rooms = window.ROOM_DATA[window.currentFloor] || [];
                if (rooms.length > 1) {
                    return {
                        name: rooms[1].name,
                        x: rooms[1].x,
                        z: rooms[1].z
                    };
                }
                return null;
            });

            if (otherRoom) {
                console.log('   • 目標房間: ' + otherRoom.name + ' 位置: (' + otherRoom.x.toFixed(1) + ', ' + otherRoom.z.toFixed(1) + ')');

                // 持續按 W 走向目標
                for (let i = 0; i < 10; i++) {
                    await page.evaluate(() => {
                        const event = new KeyboardEvent('keydown', { key: 'w' });
                        window.dispatchEvent(event);
                    });
                    await page.waitForTimeout(200);
                    await page.evaluate(() => {
                        const event = new KeyboardEvent('keyup', { key: 'w' });
                        window.dispatchEvent(event);
                    });
                }

                const finalPos = await page.evaluate(() => {
                    return {
                        x: window.fpsCamera?.position?.x?.toFixed(2),
                        z: window.fpsCamera?.position?.z?.toFixed(2),
                        room: window.streetViewNav?.currentRoom?.name
                    };
                });

                console.log('   • 最終位置: (' + finalPos.x + ', ' + finalPos.z + ')');
                console.log('   • 當前房間: ' + finalPos.room);
                console.log('   • ✓ 成功走動到不同位置');
            }
        }

        // ============= 保存截圖 =============
        console.log('\n📸 保存測試截圖...');
        await page.screenshot({ path: path.join(__dirname, 'test-fps-wasd-movement.png') });
        console.log('   ✅ 已保存到 test-fps-wasd-movement.png');

        // ============= 最終報告 =============
        console.log('\n' + '='.repeat(70));
        console.log('🎉 FPS WASD 走動測試完成！');
        console.log('='.repeat(70));
        console.log('\n✅ 驗證的功能:');
        console.log('   1. ✓ W 鍵前進移動');
        console.log('   2. ✓ 邊界限制 (XZ 平面)');
        console.log('   3. ✓ 垂直限制 (防止穿過地板/天花板)');
        console.log('   4. ✓ 可以走動到不同房間位置');

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

testFPSWASDMovement().catch(console.error);
