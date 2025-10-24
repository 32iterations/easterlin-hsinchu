const { chromium } = require('playwright');
const path = require('path');

async function identifyRemainingViolations() {
    console.log('🔎 Identifying sources of remaining boundary violations...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('📍 Loading page...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        const violationDetails = await page.evaluate(() => {
            const analysis = {
                violations: [],
                buildingBounds: { x: [-16, 16], z: [-10, 10] }
            };

            const scene = window.scene;
            if (!scene) {
                console.log('Scene not loaded');
                return analysis;
            }

            function scanObject(obj, path = '') {
                if (!obj.isMesh) {
                    if (obj.children && obj.children.length > 0) {
                        obj.children.forEach(child => {
                            scanObject(child, path + '/' + (obj.name || 'Group'));
                        });
                    }
                    return;
                }

                if (!obj.geometry) return;
                obj.geometry.computeBoundingBox();
                if (!obj.geometry.boundingBox) return;

                const bbox = obj.geometry.boundingBox;
                const worldScale = obj.scale;
                const worldPos = obj.position;

                const minX = worldPos.x + (bbox.min.x * worldScale.x);
                const maxX = worldPos.x + (bbox.max.x * worldScale.x);
                const minZ = worldPos.z + (bbox.min.z * worldScale.z);
                const maxZ = worldPos.z + (bbox.max.z * worldScale.z);

                const violations = [];
                if (minX < -16) violations.push('Left: ' + minX.toFixed(2) + ' < -16');
                if (maxX > 16) violations.push('Right: ' + maxX.toFixed(2) + ' > 16');
                if (minZ < -10) violations.push('Front: ' + minZ.toFixed(2) + ' < -10');
                if (maxZ > 10) violations.push('Back: ' + maxZ.toFixed(2) + ' > 10');

                if (violations.length > 0) {
                    analysis.violations.push({
                        path: path + '/' + obj.name,
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
                        uuid: obj.uuid,
                        userData: JSON.stringify(obj.userData || {}),
                        name: obj.name,
                        parent: obj.parent ? obj.parent.name : 'root',
                        geometryType: obj.geometry.type,
                        materialColor: obj.material ? obj.material.color.getHexString() : 'unknown'
                    });
                }

                if (obj.children && obj.children.length > 0) {
                    obj.children.forEach(child => {
                        scanObject(child, path + '/' + obj.name);
                    });
                }
            }

            scene.children.forEach(child => {
                scanObject(child);
            });

            return analysis;
        });

        console.log('\n' + '='.repeat(120));
        console.log('🎯 VIOLATION DETAILS (with object metadata)');
        console.log('='.repeat(120) + '\n');

        violationDetails.violations.forEach((v, idx) => {
            console.log((idx + 1) + '. ' + v.path);
            console.log('   Position: (' + v.position.x + ', ' + v.position.z + ')');
            console.log('   Size: ' + v.size.x + ' × ' + v.size.z);
            console.log('   Bounds: X[' + v.bounds.minX + ', ' + v.bounds.maxX + '], Z[' + v.bounds.minZ + ', ' + v.bounds.maxZ + ']');
            console.log('   Violations: ' + v.violations.join(' | '));
            console.log('   Object Name: ' + v.name);
            console.log('   Parent: ' + v.parent);
            console.log('   Geometry Type: ' + v.geometryType);
            console.log('   Material Color: 0x' + v.materialColor);
            console.log('   UserData: ' + v.userData);
            console.log('   UUID: ' + v.uuid);
            console.log();
        });

        console.log('='.repeat(120));
        console.log('Total violations: ' + violationDetails.violations.length + '\n');

    } catch (err) {
        console.error('Error:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

identifyRemainingViolations().catch(console.error);
