const { chromium } = require('playwright');
const path = require('path');

async function testCanvas() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('🌐 打開網站...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    
    // 等待canvas被創建
    await page.waitForSelector('canvas', { timeout: 5000 });
    
    // 檢查canvas尺寸
    const canvasInfo = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { found: false };
        return {
            found: true,
            width: canvas.width,
            height: canvas.height,
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
            parentId: canvas.parentElement?.id,
            visible: window.getComputedStyle(canvas).display !== 'none',
            opacity: window.getComputedStyle(canvas).opacity
        };
    });
    
    console.log('🎨 Canvas 信息:', JSON.stringify(canvasInfo, null, 2));
    
    // 檢查renderer是否存在
    const rendererInfo = await page.evaluate(() => {
        return {
            hasRenderer: !!window.renderer,
            hasScene: !!window.scene,
            hasCamera: !!window.camera,
            sceneChildCount: window.scene ? window.scene.children.length : 0
        };
    });
    
    console.log('🔧 渲染器信息:', JSON.stringify(rendererInfo, null, 2));
    
    // 截圖
    await page.screenshot({ path: path.join(__dirname, 'canvas-debug-screenshot.png') });
    
    await browser.close();
}

testCanvas().catch(console.error);
