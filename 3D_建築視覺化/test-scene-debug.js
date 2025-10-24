const { chromium } = require('playwright');

async function testScene() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const sceneInfo = await page.evaluate(() => {
        const children = window.scene.children.map((child, index) => ({
            index,
            type: child.constructor.name,
            visible: child.visible,
            position: { x: Math.round(child.position.x), y: Math.round(child.position.y), z: Math.round(child.position.z) },
            childCount: child.children ? child.children.length : 0
        }));
        
        return {
            totalChildren: window.scene.children.length,
            cameraPos: { x: Math.round(window.camera.position.x), y: Math.round(window.camera.position.y), z: Math.round(window.camera.position.z) },
            cameraTarget: window.orbitControls ? { x: Math.round(window.orbitControls.target.x), y: Math.round(window.orbitControls.target.y), z: Math.round(window.orbitControls.target.z) } : 'N/A',
            children
        };
    });
    
    console.log('🔍 Scene Debug Info:');
    console.log(JSON.stringify(sceneInfo, null, 2));
    
    await browser.close();
}

testScene().catch(console.error);
