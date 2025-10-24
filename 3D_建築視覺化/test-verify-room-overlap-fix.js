const { chromium } = require('playwright');
const path = require('path');

async function verifyRoomOverlapFix() {
    console.log('🔍 驗證房間重疊修復結果...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 執行詳細的重疊分析
        const overlapAnalysis = await page.evaluate(() => {
            const analysis = {
                totalRooms: 0,
                totalOverlaps: 0,
                floorResults: {}
            };

            Object.keys(window.ROOM_DATA || {}).forEach(floor => {
                const rooms = window.ROOM_DATA[floor];
                const overlaps = [];
                const totalRooms = rooms.length;
                analysis.totalRooms += totalRooms;

                console.log(`\n🔍 檢查樓層: ${floor}`);
                console.log(`   房間數量: ${totalRooms}`);

                // 驗證房間邊界
                const boundaryViolations = [];
                rooms.forEach(room => {
                    const r_left = room.x - room.w / 2;
                    const r_right = room.x + room.w / 2;
                    const r_top = room.z - room.d / 2;
                    const r_bottom = room.z + room.d / 2;

                    if (r_left < -16 || r_right > 16 || r_top < -10 || r_bottom > 10) {
                        boundaryViolations.push({
                            name: room.name,
                            bounds: {
                                left: r_left.toFixed(2),
                                right: r_right.toFixed(2),
                                top: r_top.toFixed(2),
                                bottom: r_bottom.toFixed(2)
                            }
                        });
                    }
                });

                if (boundaryViolations.length > 0) {
                    console.log(`   ⚠️  邊界超出警告: ${boundaryViolations.length} 間房間`);
                    boundaryViolations.forEach(violation => {
                        console.log(`      - ${violation.name}: [${violation.bounds.left}, ${violation.bounds.right}] × [${violation.bounds.top}, ${violation.bounds.bottom}]`);
                    });
                }

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

                        // 檢查是否重疊
                        const isOverlapping = !(
                            r1_right < r2_left ||
                            r1_left > r2_right ||
                            r1_bottom < r2_top ||
                            r1_top > r2_bottom
                        );

                        if (isOverlapping) {
                            const overlapLeft = Math.max(r1_left, r2_left);
                            const overlapRight = Math.min(r1_right, r2_right);
                            const overlapTop = Math.max(r1_top, r2_top);
                            const overlapBottom = Math.min(r1_bottom, r2_bottom);

                            const overlapWidth = overlapRight - overlapLeft;
                            const overlapHeight = overlapBottom - overlapTop;
                            const overlapArea = Math.max(0, overlapWidth) * Math.max(0, overlapHeight);

                            overlaps.push({
                                room1: room1.name,
                                room2: room2.name,
                                overlapArea: overlapArea.toFixed(2)
                            });
                        }
                    }
                }

                analysis.floorResults[floor] = {
                    totalRooms: totalRooms,
                    overlapCount: overlaps.length,
                    boundaryViolations: boundaryViolations.length,
                    overlaps: overlaps
                };

                analysis.totalOverlaps += overlaps.length;
            });

            return analysis;
        });

        // 顯示驗證結果
        console.log('\n' + '='.repeat(80));
        console.log('📊 房間重疊修復驗證結果');
        console.log('='.repeat(80));

        console.log(`\n總房間數: ${overlapAnalysis.totalRooms}`);
        console.log(`總重疊房間對: ${overlapAnalysis.totalOverlaps}\n`);

        let allFloorsPass = true;
        Object.keys(overlapAnalysis.floorResults).forEach(floor => {
            const data = overlapAnalysis.floorResults[floor];
            const status = data.overlapCount === 0 && data.boundaryViolations === 0 ? '✅' : '❌';

            console.log(`${status} ${floor} 樓層:`);
            console.log(`   房間數: ${data.totalRooms}`);
            console.log(`   重疊對: ${data.overlapCount}`);
            console.log(`   邊界違規: ${data.boundaryViolations}`);

            if (data.overlapCount > 0) {
                allFloorsPass = false;
                console.log('   重疊詳情:');
                data.overlaps.forEach((overlap, idx) => {
                    console.log(`      ${idx + 1}. ${overlap.room1} ↔ ${overlap.room2}`);
                    console.log(`         重疊面積: ${overlap.overlapArea} 平方單位`);
                });
            }

            if (data.boundaryViolations > 0) {
                allFloorsPass = false;
                console.log('   ⚠️ 警告: 存在邊界超出的房間');
            }

            console.log();
        });

        console.log('='.repeat(80));
        if (overlapAnalysis.totalOverlaps === 0) {
            console.log('✅ 修復成功！所有樓層房間配置正確，沒有重疊！');
        } else {
            console.log(`❌ 修復未完成: 仍然存在 ${overlapAnalysis.totalOverlaps} 對重疊房間`);
        }
        console.log('='.repeat(80));

        // 保存驗證報告
        console.log('\n📝 保存驗證報告...');
        await page.screenshot({ path: path.join(__dirname, 'verify-room-overlap-fix.png') });
        console.log('   ✅ 已保存驗證截圖到 verify-room-overlap-fix.png');

        // 顯示驗證統計
        console.log('\n📈 驗證統計:');
        console.log(`   ✓ 檢查樓層: ${Object.keys(overlapAnalysis.floorResults).length}`);
        console.log(`   ✓ 檢查房間: ${overlapAnalysis.totalRooms}`);
        console.log(`   ✓ 發現重疊: ${overlapAnalysis.totalOverlaps}`);
        console.log(`   ✓ 修復狀態: ${overlapAnalysis.totalOverlaps === 0 ? '完成' : '未完成'}`);

    } catch (err) {
        console.error('❌ 驗證失敗:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

verifyRoomOverlapFix().catch(console.error);
