const { chromium } = require('playwright');
const path = require('path');

async function diagnoseRoomOverlap() {
    console.log('🏢 診斷樓層平面圖房間重疊問題...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 檢查所有樓層的房間是否重疊
        const overlapAnalysis = await page.evaluate(() => {
            const analysis = {};

            Object.keys(window.ROOM_DATA || {}).forEach(floor => {
                const rooms = window.ROOM_DATA[floor];
                const overlaps = [];
                const totalRooms = rooms.length;

                console.log(`\n🔍 檢查樓層: ${floor}`);
                console.log(`   房間數量: ${totalRooms}`);

                // 檢查每對房間是否重疊
                for (let i = 0; i < rooms.length; i++) {
                    for (let j = i + 1; j < rooms.length; j++) {
                        const room1 = rooms[i];
                        const room2 = rooms[j];

                        // 計算房間邊界
                        const r1_left = room1.x - room1.w / 2;
                        const r1_right = room1.x + room1.w / 2;
                        const r1_top = room1.z - room1.d / 2;
                        const r1_bottom = room1.z + room1.d / 2;

                        const r2_left = room2.x - room2.w / 2;
                        const r2_right = room2.x + room2.w / 2;
                        const r2_top = room2.z - room2.d / 2;
                        const r2_bottom = room2.z + room2.d / 2;

                        // 檢查是否重疊（AABB 碰撞檢測）
                        const isOverlapping = !(
                            r1_right < r2_left ||   // r1 在 r2 左邊
                            r1_left > r2_right ||   // r1 在 r2 右邊
                            r1_bottom < r2_top ||   // r1 在 r2 上邊
                            r1_top > r2_bottom      // r1 在 r2 下邊
                        );

                        if (isOverlapping) {
                            // 計算重疊面積
                            const overlapLeft = Math.max(r1_left, r2_left);
                            const overlapRight = Math.min(r1_right, r2_right);
                            const overlapTop = Math.max(r1_top, r2_top);
                            const overlapBottom = Math.min(r1_bottom, r2_bottom);

                            const overlapWidth = overlapRight - overlapLeft;
                            const overlapHeight = overlapBottom - overlapTop;
                            const overlapArea = Math.max(0, overlapWidth) * Math.max(0, overlapHeight);

                            overlaps.push({
                                room1: room1.name || `Room ${room1.id}`,
                                room2: room2.name || `Room ${room2.id}`,
                                room1Bounds: { left: r1_left.toFixed(2), right: r1_right.toFixed(2), top: r1_top.toFixed(2), bottom: r1_bottom.toFixed(2) },
                                room2Bounds: { left: r2_left.toFixed(2), right: r2_right.toFixed(2), top: r2_top.toFixed(2), bottom: r2_bottom.toFixed(2) },
                                overlapArea: overlapArea.toFixed(2)
                            });
                        }
                    }
                }

                analysis[floor] = {
                    totalRooms: totalRooms,
                    overlapCount: overlaps.length,
                    overlaps: overlaps
                };
            });

            return analysis;
        });

        // 顯示分析結果
        console.log('\n' + '='.repeat(80));
        console.log('📊 房間重疊分析結果');
        console.log('='.repeat(80));

        let totalOverlaps = 0;
        Object.keys(overlapAnalysis).forEach(floor => {
            const data = overlapAnalysis[floor];
            totalOverlaps += data.overlapCount;

            console.log(`\n📍 樓層: ${floor}`);
            console.log(`   總房間數: ${data.totalRooms}`);
            console.log(`   重疊房間對: ${data.overlapCount}`);

            if (data.overlapCount > 0) {
                console.log('   ⚠️  重疊詳情:');
                data.overlaps.forEach((overlap, idx) => {
                    console.log(`      ${idx + 1}. ${overlap.room1} ↔ ${overlap.room2}`);
                    console.log(`         重疊面積: ${overlap.overlapArea} 平方單位`);
                    console.log(`         房間1邊界: X[${overlap.room1Bounds.left}, ${overlap.room1Bounds.right}], Z[${overlap.room1Bounds.top}, ${overlap.room1Bounds.bottom}]`);
                    console.log(`         房間2邊界: X[${overlap.room2Bounds.left}, ${overlap.room2Bounds.right}], Z[${overlap.room2Bounds.top}, ${overlap.room2Bounds.bottom}]`);
                });
            } else {
                console.log('   ✅ 無重疊房間');
            }
        });

        console.log('\n' + '='.repeat(80));
        if (totalOverlaps === 0) {
            console.log('✅ 所有樓層房間配置正確，沒有重疊！');
            console.log('\n平面圖顯示重疊可能原因：');
            console.log('  1. Canvas 縮放計算問題（房間實際不重疊，但顯示重疊）');
            console.log('  2. 房間位置轉換錯誤');
            console.log('  3. 視覺上的透明度或邊框疊加');
        } else {
            console.log(`❌ 發現 ${totalOverlaps} 對重疊房間！`);
        }
        console.log('='.repeat(80));

        // 保存截圖
        console.log('\n📸 保存診斷截圖...');
        await page.screenshot({ path: path.join(__dirname, 'floorplan-overlap-diagnosis.png') });
        console.log('   ✅ 已保存到 floorplan-overlap-diagnosis.png');

    } catch (err) {
        console.error('❌ 診斷失敗:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

diagnoseRoomOverlap().catch(console.error);
