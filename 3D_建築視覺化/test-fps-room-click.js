const { chromium } = require('playwright');
const path = require('path');

async function testFPSRoomClick() {
    console.log('🎯 開始測試 FPS 房間點擊導航...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 200 });
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

        const modeCheck = await page.evaluate(() => {
            return {
                currentMode: window.currentMode,
                fpsToggleBtnVisible: document.getElementById('fps-room-toggle-btn')?.classList.contains('visible'),
                fpsPanelVisible: document.getElementById('fps-room-panel')?.classList.contains('visible')
            };
        });
        console.log('   • 當前模式: ' + modeCheck.currentMode);
        console.log('   • FPS切換按鈕可見: ' + (modeCheck.fpsToggleBtnVisible ? '✓' : '✗'));
        console.log('   • FPS房間面板可見: ' + (modeCheck.fpsPanelVisible ? '✓' : '✗'));

        // =========== 步驟2: 檢查房間列表 ===========
        console.log('\n✅ 步驟2: 檢查房間列表');
        const roomsList = await page.evaluate(() => {
            const leftPanelItems = document.querySelectorAll('#rooms-list .room-item');
            const fpsPanelItems = document.querySelectorAll('#fps-rooms-list .room-item');

            return {
                leftPanelRoomCount: leftPanelItems.length,
                fpsPanelRoomCount: fpsPanelItems.length,
                leftPanelRooms: Array.from(leftPanelItems).slice(0, 3).map(item => ({
                    name: item.querySelector('.room-name')?.textContent?.trim(),
                    clickable: item.style.pointerEvents !== 'none'
                })),
                fpsPanelRooms: Array.from(fpsPanelItems).slice(0, 3).map(item => ({
                    name: item.querySelector('.room-name')?.textContent?.trim(),
                    clickable: item.style.pointerEvents !== 'none'
                }))
            };
        });
        console.log('   • 左側面板房間數: ' + roomsList.leftPanelRoomCount);
        console.log('   • FPS浮動面板房間數: ' + roomsList.fpsPanelRoomCount);
        console.log('   • 左側面板前3個房間:');
        roomsList.leftPanelRooms.forEach((room, i) => {
            console.log('     ' + (i+1) + '. ' + room.name + ' (可點: ' + (room.clickable ? '✓' : '✗') + ')');
        });
        console.log('   • FPS面板前3個房間:');
        roomsList.fpsPanelRooms.forEach((room, i) => {
            console.log('     ' + (i+1) + '. ' + room.name + ' (可點: ' + (room.clickable ? '✓' : '✗') + ')');
        });

        // =========== 步驟3: 點擊房間 ===========
        console.log('\n✅ 步驟3: 點擊第一個房間進入');

        const roomButtons = await page.$$('.room-item');
        if (roomButtons.length > 0) {
            const firstRoom = await page.evaluate(() => {
                const btn = document.querySelector('.room-item');
                return {
                    name: btn?.querySelector('.room-name')?.textContent?.trim(),
                    text: btn?.textContent?.trim()?.substring(0, 50)
                };
            });
            console.log('   正在點擊房間: ' + firstRoom.name);

            // 獲取點擊前的相機位置
            const beforeClick = await page.evaluate(() => {
                return {
                    cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                    cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                    cameraZ: window.fpsCamera?.position?.z?.toFixed(2),
                    currentRoom: window.streetViewNav?.currentRoom?.name || '無'
                };
            });
            console.log('   點擊前:');
            console.log('   • 相機位置: (' + beforeClick.cameraX + ', ' + beforeClick.cameraY + ', ' + beforeClick.cameraZ + ')');
            console.log('   • 當前房間: ' + beforeClick.currentRoom);

            // 點擊房間
            await roomButtons[0].click();
            await page.waitForTimeout(3000);

            // 獲取點擊後的相機位置和房間
            const afterClick = await page.evaluate(() => {
                return {
                    cameraX: window.fpsCamera?.position?.x?.toFixed(2),
                    cameraY: window.fpsCamera?.position?.y?.toFixed(2),
                    cameraZ: window.fpsCamera?.position?.z?.toFixed(2),
                    currentRoom: window.streetViewNav?.currentRoom?.name || '無',
                    isTransitioning: window.streetViewNav?.isTransitioning,
                    sceneChildCount: window.scene?.children?.length || 0
                };
            });
            console.log('   點擊後:');
            console.log('   • 相機位置: (' + afterClick.cameraX + ', ' + afterClick.cameraY + ', ' + afterClick.cameraZ + ')');
            console.log('   • 當前房間: ' + afterClick.currentRoom);
            console.log('   • 過渡中: ' + (afterClick.isTransitioning ? '是' : '否'));
            console.log('   • 場景物體數: ' + afterClick.sceneChildCount);

            // 檢查導航是否成功
            if (afterClick.currentRoom === firstRoom.name || (afterClick.cameraX !== beforeClick.cameraX && afterClick.cameraZ !== beforeClick.cameraZ)) {
                console.log('   ✓ 房間導航成功！');
            } else {
                console.log('   ✗ 房間導航失敗 - 相機位置未改變');
            }
        }

        // =========== 步驟4: 檢查場景狀態 ===========
        console.log('\n✅ 步驟4: 檢查3D場景完整性');
        const sceneHealth = await page.evaluate(() => {
            return {
                sceneExists: !!window.scene,
                rendererExists: !!window.renderer,
                fpsCameraExists: !!window.fpsCamera,
                floorData: Object.keys(window.ROOM_DATA || {}).length,
                sceneMeshes: window.scene?.children?.filter(c => c.isMesh)?.length || 0,
                sceneGroups: window.scene?.children?.filter(c => c.isGroup)?.length || 0
            };
        });
        console.log('   • Scene 存在: ' + (sceneHealth.sceneExists ? '✓' : '✗'));
        console.log('   • Renderer 存在: ' + (sceneHealth.rendererExists ? '✓' : '✗'));
        console.log('   • FPS相機存在: ' + (sceneHealth.fpsCameraExists ? '✓' : '✗'));
        console.log('   • 樓層數據: ' + sceneHealth.floorData);
        console.log('   • 場景Mesh數: ' + sceneHealth.sceneMeshes);
        console.log('   • 場景Group數: ' + sceneHealth.sceneGroups);

        // 保存截圖
        console.log('\n📸 保存FPS房間導航測試截圖...');
        await page.screenshot({ path: path.join(__dirname, 'test-fps-room-click.png') });
        console.log('   ✅ 已保存到 test-fps-room-click.png');

        // 最終報告
        console.log('\n' + '='.repeat(70));
        console.log('🎉 FPS房間點擊導航測試完成！');
        console.log('='.repeat(70));

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

testFPSRoomClick().catch(console.error);
