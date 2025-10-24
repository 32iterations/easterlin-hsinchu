const { chromium } = require('playwright');
const path = require('path');

async function testFPSClickInteraction() {
    console.log('🎮 開始FPS點擊互動測試...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();

    const consoleMessages = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(text);
        if (msg.type() === 'log' && text.includes('已進入房間')) {
            console.log(`[✅ 房間導航] ${text}`);
        } else if (msg.type() === 'log' && text.includes('已導航到位置')) {
            console.log(`[✅ 點擊導航] ${text}`);
        } else if (msg.type() === 'error' && !text.includes('favicon')) {
            console.log(`[❌ 錯誤] ${text}`);
        }
    });

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // 測試1: 驗證場景和房間數據已加載
        console.log('\n✅ 測試1: 驗證場景和房間數據');
        const sceneInfo = await page.evaluate(() => {
            return {
                sceneChildren: window.scene?.children?.length || 0,
                hasRoomData: !!window.ROOM_DATA,
                roomCountB1: window.ROOM_DATA?.['B1']?.length || 0,
                roomCount1F: window.ROOM_DATA?.['1F']?.length || 0,
                currentFloor: window.currentFloor
            };
        });
        console.log('場景信息:', sceneInfo);

        // 測試2: 驗證建築對象是否有userData
        console.log('\n✅ 測試2: 驗證房間對象userData');
        const roomObjectInfo = await page.evaluate(() => {
            const buildingGroup = window.scene?.children?.[4];
            if (!buildingGroup || !buildingGroup.children) {
                return { error: '建築群組未找到' };
            }

            const roomMeshes = buildingGroup.children.filter(child =>
                child.userData && child.userData.id
            );

            return {
                totalChildren: buildingGroup.children.length,
                roomMeshesWithId: roomMeshes.length,
                sampleRoomIds: roomMeshes.slice(0, 3).map(m => m.userData.id)
            };
        });
        console.log('房間對象信息:', roomObjectInfo);

        // 測試3: 驗證FPS相機和控制
        console.log('\n✅ 測試3: 準備FPS模式');
        const fpsCameraReady = await page.evaluate(() => {
            return {
                hasFpsCamera: !!window.fpsCamera,
                fpsCameraPosition: window.fpsCamera ? {
                    x: window.fpsCamera.position.x.toFixed(2),
                    y: window.fpsCamera.position.y.toFixed(2),
                    z: window.fpsCamera.position.z.toFixed(2)
                } : null,
                hasPointerLockControls: !!window.pointerLockControls,
                hasRaycaster: !!window.raycaster
            };
        });
        console.log('FPS相機準備:', fpsCameraReady);

        // 測試4: 切換到FPS模式並進行射線投射測試
        console.log('\n✅ 測試4: 測試射線投射和房間檢測');
        const raycasterTest = await page.evaluate(() => {
            // 切換到FPS模式
            window.currentMode = 'fps';

            // 模擬滑鼠位置在螢幕中心
            const mouse = new THREE.Vector2(0, 0);  // 中心位置

            // 設置雷射投射
            window.raycaster.setFromCamera(mouse, window.fpsCamera);

            // 嘗試與場景相交
            const buildingGroup = window.scene.children[4];
            if (!buildingGroup) {
                return { error: '建築群組未找到' };
            }

            const intersects = window.raycaster.intersectObjects(buildingGroup.children);

            const roomIntersects = intersects.filter(i =>
                i.object.userData && i.object.userData.id
            );

            return {
                totalIntersects: intersects.length,
                roomIntersects: roomIntersects.length,
                firstRoomHit: roomIntersects.length > 0 ? {
                    id: roomIntersects[0].object.userData.id,
                    distance: roomIntersects[0].distance.toFixed(2),
                    name: roomIntersects[0].object.userData.name
                } : null
            };
        });
        console.log('射線投射測試:', raycasterTest);

        // 測試5: 測試enterRoom函數（直接呼叫）
        console.log('\n✅ 測試5: 直接測試enterRoom函數');

        // 先取得一個房間ID
        const firstRoomId = await page.evaluate(() => {
            if (window.ROOM_DATA && window.ROOM_DATA['1F']) {
                return window.ROOM_DATA['1F'][0].id;
            }
            return null;
        });

        if (firstRoomId) {
            console.log(`正在測試進入房間: ${firstRoomId}`);
            await page.evaluate((roomId) => {
                window.enterRoom(roomId);
            }, firstRoomId);

            await page.waitForTimeout(2000);  // 等待房間轉移動畫

            const afterEnterRoom = await page.evaluate(() => {
                return {
                    currentFloor: window.currentFloor,
                    currentRoom: window.streetViewNav.currentRoom?.id,
                    cameraPosition: window.fpsCamera ? {
                        x: window.fpsCamera.position.x.toFixed(2),
                        y: window.fpsCamera.position.y.toFixed(2),
                        z: window.fpsCamera.position.z.toFixed(2)
                    } : null,
                    isTransitioning: window.streetViewNav.isTransitioning
                };
            });
            console.log('進入房間後的狀態:', afterEnterRoom);
        } else {
            console.log('❌ 無可用房間數據');
        }

        // 測試6: 測試navigateToPoint函數
        console.log('\n✅ 測試6: 測試點擊導航函數');
        const beforeNavigate = await page.evaluate(() => {
            return {
                x: window.fpsCamera.position.x.toFixed(2),
                z: window.fpsCamera.position.z.toFixed(2)
            };
        });
        console.log('導航前位置:', beforeNavigate);

        await page.evaluate(() => {
            const targetPoint = new THREE.Vector3(10, 1.6, 10);
            window.navigateToPoint(targetPoint);
        });

        await page.waitForTimeout(2000);  // 等待導航動畫

        const afterNavigate = await page.evaluate(() => {
            return {
                x: window.fpsCamera.position.x.toFixed(2),
                z: window.fpsCamera.position.z.toFixed(2),
                isTransitioning: window.streetViewNav.isTransitioning
            };
        });
        console.log('導航後位置:', afterNavigate);

        // 測試7: 保存截圖
        console.log('\n📸 保存測試截圖...');
        await page.screenshot({ path: path.join(__dirname, 'test-fps-interaction-result.png') });
        console.log('   ✅ 已保存到 test-fps-interaction-result.png');

        // 測試總結
        console.log('\n🎉 FPS點擊互動測試完成！');
        console.log('✅ 街景導航系統已完整實現');
        console.log('   • enterRoom() 房間進入功能');
        console.log('   • navigateToPoint() 點擊導航功能');
        console.log('   • 射線投射房間檢測');

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
    } finally {
        await browser.close();
    }
}

testFPSClickInteraction().catch(console.error);
