const { chromium } = require('playwright');
const path = require('path');

async function enhancedViolationDetective() {
    console.log('🔎 Enhanced Violation Detective - Full Object Chain Analysis\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('📍 Loading page...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        const violationDetails = await page.evaluate(() => {
            const violations = [];
            const scene = window.scene;

            if (!scene) {
                console.log('Scene not loaded');
                return violations;
            }

            // Recursively get full parent chain
            function getObjectPath(obj) {
                const path = [];
                let current = obj;
                while (current) {
                    path.unshift({
                        name: current.name,
                        type: current.type,
                        uuid: current.uuid
                    });
                    current = current.parent;
                }
                return path;
            }

            // Scan all meshes
            function scanObject(obj) {
                if (!obj.isMesh) {
                    if (obj.children && obj.children.length > 0) {
                        obj.children.forEach(child => scanObject(child));
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

                // Check for violations
                const violationsList = [];
                if (minX < -16) violationsList.push('Left: ' + minX.toFixed(2) + ' < -16');
                if (maxX > 16) violationsList.push('Right: ' + maxX.toFixed(2) + ' > 16');
                if (minZ < -10) violationsList.push('Front: ' + minZ.toFixed(2) + ' < -10');
                if (maxZ > 10) violationsList.push('Back: ' + maxZ.toFixed(2) + ' > 10');

                if (violationsList.length > 0) {
                    const fullPath = getObjectPath(obj);
                    violations.push({
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
                        violations: violationsList,
                        mesh: {
                            name: obj.name,
                            uuid: obj.uuid,
                            geometryType: obj.geometry.type,
                            materialColor: obj.material ? obj.material.color.getHexString() : 'none',
                            visible: obj.visible,
                            castShadow: obj.castShadow
                        },
                        parentChain: fullPath,
                        userData: JSON.stringify(obj.userData || {})
                    });
                }

                if (obj.children && obj.children.length > 0) {
                    obj.children.forEach(child => scanObject(child));
                }
            }

            scene.children.forEach(child => scanObject(child));
            return violations;
        });

        console.log('╔' + '═'.repeat(118) + '╗');
        console.log('║ 🔎 ENHANCED VIOLATION DETECTIVE - FULL OBJECT ANALYSIS');
        console.log('╚' + '═'.repeat(118) + '╝\n');

        violationDetails.forEach((v, idx) => {
            console.log(`\n${'─'.repeat(120)}`);
            console.log(`VIOLATION #${idx + 1}`);
            console.log(`${'─'.repeat(120)}`);

            console.log(`\n📍 Position & Size:`);
            console.log(`   Pos: (${v.position.x}, ${v.position.z})`);
            console.log(`   Size: ${v.size.x} × ${v.size.z}`);

            console.log(`\n📐 Boundary Status:`);
            console.log(`   X bounds: [${v.bounds.minX}, ${v.bounds.maxX}]`);
            console.log(`   Z bounds: [${v.bounds.minZ}, ${v.bounds.maxZ}]`);
            console.log(`   Violations: ${v.violations.join(' | ')}`);

            console.log(`\n🎨 Mesh Properties:`);
            console.log(`   Name: ${v.mesh.name}`);
            console.log(`   UUID: ${v.mesh.uuid}`);
            console.log(`   Geometry: ${v.mesh.geometryType}`);
            console.log(`   Color: 0x${v.mesh.materialColor}`);
            console.log(`   Visible: ${v.mesh.visible}`);
            console.log(`   CastShadow: ${v.mesh.castShadow}`);

            console.log(`\n🌳 Parent Chain (Scene Graph):`);
            v.parentChain.forEach((parent, pidx) => {
                const indent = '   '.repeat(pidx);
                console.log(`${indent}├─ [${parent.type}] ${parent.name}`);
            });

            if (v.userData !== '{}') {
                console.log(`\n📦 UserData:`);
                console.log(`   ${v.userData}`);
            }
        });

        console.log(`\n${'═'.repeat(120)}`);
        console.log(`📊 SUMMARY: ${violationDetails.length} violations found`);
        console.log(`${'═'.repeat(120)}\n`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err.stack);
    } finally {
        await browser.close();
    }
}

enhancedViolationDetective().catch(console.error);
