const { chromium } = require('playwright');
const path = require('path');

async function verifyUILayout() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // 驗證UI層級
        const uiLayout = await page.evaluate(() => {
            const minimap = document.getElementById('minimap');
            const debugLog = document.getElementById('debug-log');
            const rightPanel = document.getElementById('right-panel');
            
            return {
                minimap: {
                    visible: minimap ? window.getComputedStyle(minimap).display !== 'none' : false,
                    zIndex: minimap ? window.getComputedStyle(minimap).zIndex : 'N/A',
                    bottom: minimap ? window.getComputedStyle(minimap).bottom : 'N/A',
                    left: minimap ? window.getComputedStyle(minimap).left : 'N/A'
                },
                debugLog: {
                    visible: debugLog ? window.getComputedStyle(debugLog).display !== 'none' : false,
                    zIndex: debugLog ? window.getComputedStyle(debugLog).zIndex : 'N/A',
                    bottom: debugLog ? window.getComputedStyle(debugLog).bottom : 'N/A',
                    right: debugLog ? window.getComputedStyle(debugLog).right : 'N/A'
                },
                rightPanelExists: !!rightPanel
            };
        });
        
        console.log('\n✅ UI層級佈局驗證:');
        console.log('樓層平面圖 (minimap):', uiLayout.minimap);
        console.log('調試日誌 (debug-log):', uiLayout.debugLog);
        console.log('右側統計面板:', uiLayout.rightPanelExists ? '存在' : '不存在');
        
        // Take screenshot
        await page.screenshot({ path: path.join(__dirname, 'ui-layout-fixed.png') });
        console.log('\n📸 已保存截圖: ui-layout-fixed.png');
        
        // Check if elements overlap
        const overlapCheck = await page.evaluate(() => {
            const minimap = document.getElementById('minimap');
            const debugLog = document.getElementById('debug-log');
            
            if (!minimap || !debugLog) return { error: '找不到元素' };
            
            const minimapRect = minimap.getBoundingClientRect();
            const debugLogRect = debugLog.getBoundingClientRect();
            
            const overlap = !(minimapRect.right < debugLogRect.left ||
                            debugLogRect.right < minimapRect.left ||
                            minimapRect.bottom < debugLogRect.top ||
                            debugLogRect.bottom < minimapRect.top);
            
            return {
                minimap: { x: minimapRect.x, y: minimapRect.y, width: minimapRect.width, height: minimapRect.height },
                debugLog: { x: debugLogRect.x, y: debugLogRect.y, width: debugLogRect.width, height: debugLogRect.height },
                overlap: overlap
            };
        });
        
        console.log('\n✅ 重疊檢查:', overlapCheck);
        if (overlapCheck.overlap) {
            console.log('⚠️  警告: 元素有重疊!');
        } else {
            console.log('✅ 無重疊');
        }
        
    } finally {
        await browser.close();
    }
}

verifyUILayout().catch(console.error);
