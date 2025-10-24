const { chromium } = require('playwright');
const path = require('path');

async function verifyMinimapFix() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // 驗證minimap是否可見
        const minimapInfo = await page.evaluate(() => {
            const minimap = document.getElementById('minimap');
            const canvas = document.getElementById('minimap-canvas');
            const rect = minimap?.getBoundingClientRect();
            
            return {
                minimapExists: !!minimap,
                canvasExists: !!canvas,
                minimapVisible: minimap ? window.getComputedStyle(minimap).display !== 'none' : false,
                minimapZIndex: minimap ? window.getComputedStyle(minimap).zIndex : 'N/A',
                minimapOverflow: minimap ? window.getComputedStyle(minimap).overflow : 'N/A',
                position: rect ? { bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height } : null
            };
        });
        
        console.log('✅ 樓層平面圖狀態:', minimapInfo);
        
        // 驗證房間列表是否可點擊
        const roomListInfo = await page.evaluate(() => {
            const roomList = document.querySelector('.rooms-list');
            const buttons = document.querySelectorAll('.room-item');
            
            return {
                roomListVisible: roomList ? window.getComputedStyle(roomList).display !== 'none' : false,
                buttonCount: buttons.length,
                firstButtonText: buttons[0]?.textContent.trim().substring(0, 50) || 'N/A'
            };
        });
        
        console.log('✅ 房間列表狀態:', roomListInfo);
        
        // Take screenshot
        await page.screenshot({ path: path.join(__dirname, 'minimap-fix-verification.png') });
        console.log('📸 已保存截圖: minimap-fix-verification.png');
        
    } finally {
        await browser.close();
    }
}

verifyMinimapFix().catch(console.error);
