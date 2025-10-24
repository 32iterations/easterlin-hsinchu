const { chromium } = require('playwright');
const path = require('path');

async function diagnoseFurnitureBoundaries() {
    console.log('🏗️ 診斷房間內物體超出建築邊界問題...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // 掃描場景中所有物體並檢查邊界
        const boundaryAnalysis = await page.evaluate(() => {
            const analysis = {
                buildingBounds: { x: [-16, 16], z: [-10, 10] },
                violations: [],
                roomFurniture: {},
                summary: { total: 0, violations: 0, affected_rooms: new Set() }
            };

            // 獲取場景中的所有物體
            const scene = window.scene;
            if (!scene) {
                console.log('⚠️ 場景未加載');
                return analysis;
            }

            // 遍歷場景中的所有物體
            function checkMesh(mesh, path = '') {
                if (!mesh.geometry || !mesh.position) return;

                const geometry = mesh.geometry;
                geometry.computeBoundingBox();

                if (!geometry.boundingBox) return;

                // 獲取物體的邊界框
                const bbox = geometry.boundingBox;
                const worldScale = mesh.scale;
                const worldPos = mesh.position;

                // 計算世界坐標中的邊界
                const minX = worldPos.x + (bbox.min.x * worldScale.x);
                const maxX = worldPos.x + (bbox.max.x * worldScale.x);
                const minZ = worldPos.z + (bbox.min.z * worldScale.z);
                const maxZ = worldPos.z + (bbox.max.z * worldScale.z);

                // 檢查是否超出邊界
                const violations = [];
                if (minX < -16) violations.push(`左邊界: ${minX.toFixed(2)} < -16`);
                if (maxX > 16) violations.push(`右邊界: ${maxX.toFixed(2)} > 16`);
                if (minZ < -10) violations.push(`前邊界: ${minZ.toFixed(2)} < -10`);
                if (maxZ > 10) violations.push(`後邊界: ${maxZ.toFixed(2)} > 10`);

                if (violations.length > 0) {
                    const violation = {
                        path: path,
                        position: { x: worldPos.x.toFixed(2), z: worldPos.z.toFixed(2) },
                        size: {
                            x: (bbox.max.x - bbox.min.x).toFixed(2),
                            z: (bbox.max.z - bbox.min.z).toFixed(2)
                        },
                        bounds: {
                            minX: minX.toFixed(2),
                            maxX: maxX.toFixed(2),
                            minZ: minZ.toFixed(2),
                            maxZ: maxZ.toFixed(2)
                        },
                        violations: violations,
                        userData: mesh.userData || {}
                    };

                    analysis.violations.push(violation);
                    analysis.summary.violations++;

                    // 記錄受影響的房間
                    if (mesh.userData && mesh.userData.name) {
                        if (!analysis.roomFurniture[mesh.userData.name]) {
                            analysis.roomFurniture[mesh.userData.name] = [];
                            analysis.summary.affected_rooms.add(mesh.userData.name);
                        }
                        analysis.roomFurniture[mesh.userData.name].push({
                            violations: violations,
                            bounds: violation.bounds
                        });
                    }
                }

                analysis.summary.total++;
            }

            // 遞歸掃描所有物體
            function scanObject(obj, path = '') {
                if (obj.isMesh) {
                    checkMesh(obj, path + '/' + (obj.name || 'Mesh'));
                }

                if (obj.children && obj.children.length > 0) {
                    obj.children.forEach(child => {
                        scanObject(child, path + '/' + (obj.name || 'Group'));
                    });
                }
            }

            scene.children.forEach(child => {
                scanObject(child);
            });

            return analysis;
        });

        // 顯示分析結果
        console.log('\n' + '='.repeat(100));
        console.log('📊 建築邊界衝突分析結果');
        console.log('='.repeat(100));

        console.log(`\n建築邊界: X[-16, 16] × Z[-10, 10]`);
        console.log(`掃描物體總數: ${boundaryAnalysis.summary.total}`);
        console.log(`邊界衝突物體: ${boundaryAnalysis.summary.violations}`);
        console.log(`受影響房間數: ${boundaryAnalysis.summary.affected_rooms.size}`);

        if (boundaryAnalysis.violations.length > 0) {
            console.log('\n⚠️ 邊界衝突詳情:');
            console.log('='.repeat(100));

            boundaryAnalysis.violations.forEach((v, idx) => {
                console.log(`\n${idx + 1}. ${v.path}`);
                console.log(`   位置: (${v.position.x}, ${v.position.z})`);
                console.log(`   尺寸: ${v.size.x} × ${v.size.z}`);
                console.log(`   邊界: X[${v.bounds.minX}, ${v.bounds.maxX}], Z[${v.bounds.minZ}, ${v.bounds.maxZ}]`);
                v.violations.forEach(violation => {
                    console.log(`   ❌ ${violation}`);
                });
                if (v.userData && (v.userData.name || v.userData.room)) {
                    console.log(`   房間: ${v.userData.name || v.userData.room}`);
                }
            });

            console.log('\n' + '='.repeat(100));
            console.log('🔍 按房間分類的衝突:');
            console.log('='.repeat(100));

            for (const [room, violations] of Object.entries(boundaryAnalysis.roomFurniture)) {
                console.log(`\n📍 ${room}:`);
                violations.forEach((v, idx) => {
                    console.log(`   ${idx + 1}. ${v.violations.join(' | ')}`);
                    console.log(`      邊界: X[${v.bounds.minX}, ${v.bounds.maxX}], Z[${v.bounds.minZ}, ${v.bounds.maxZ}]`);
                });
            }
        } else {
            console.log('\n✅ 所有物體都在建築邊界內！');
        }

        console.log('\n' + '='.repeat(100));

        // 保存診斷截圖
        console.log('\n📸 保存診斷截圖...');
        await page.screenshot({ path: path.join(__dirname, 'furniture-boundary-diagnosis.png') });
        console.log('   ✅ 已保存到 furniture-boundary-diagnosis.png');

        // 返回JSON格式供後續分析
        return boundaryAnalysis;

    } catch (err) {
        console.error('❌ 診斷失敗:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

diagnoseFurnitureBoundaries().catch(console.error);
