const { chromium } = require('playwright');
const path = require('path');

async function testControlPanel() {
    console.log('🎯 開始測試控制面板可見性...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 100 });
    const page = await browser.newPage();

    try {
        console.log('📍 正在加載頁面...');
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        // =========== 測試1: 檢查控制面板是否存在並可見 ===========
        console.log('\n✅ 測試1: 檢查控制面板DOM元素');
        const controlPanel = await page.evaluate(() => {
            const panel = document.getElementById('control-panel');
            if (!panel) return { exists: false };

            const style = window.getComputedStyle(panel);
            const rect = panel.getBoundingClientRect();

            return {
                exists: true,
                display: style.display,
                visibility: style.visibility,
                position: style.position,
                zIndex: style.zIndex,
                bottom: style.bottom,
                right: style.right,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                isVisible: style.display !== 'none' && style.visibility !== 'hidden',
                isInViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
            };
        });

        console.log('   控制面板檢查結果:');
        console.log('   • 存在: ' + (controlPanel.exists ? '✓' : '✗'));
        if (controlPanel.exists) {
            console.log('   • Display: ' + controlPanel.display);
            console.log('   • Visibility: ' + controlPanel.visibility);
            console.log('   • Position: ' + controlPanel.position);
            console.log('   • Z-Index: ' + controlPanel.zIndex);
            console.log('   • Bottom: ' + controlPanel.bottom);
            console.log('   • Right: ' + controlPanel.right);
            console.log('   • 尺寸: ' + controlPanel.width + 'px × ' + controlPanel.height + 'px');
            console.log('   • 屏幕位置: (' + controlPanel.left.toFixed(1) + ', ' + controlPanel.top.toFixed(1) + ')');
            console.log('   • 是否可見: ' + (controlPanel.isVisible ? '✓ 是' : '✗ 否'));
            console.log('   • 在視口內: ' + (controlPanel.isInViewport ? '✓ 是' : '✗ 否'));
        }

        // =========== 測試2: 檢查按鈕是否可點擊 ===========
        console.log('\n✅ 測試2: 檢查控制面板按鈕');
        const buttons = await page.evaluate(() => {
            const btns = document.querySelectorAll('#control-panel .ctrl-btn');
            return {
                count: btns.length,
                buttons: Array.from(btns).map((btn, i) => {
                    const style = window.getComputedStyle(btn);
                    const rect = btn.getBoundingClientRect();
                    return {
                        index: i,
                        text: btn.textContent.trim(),
                        display: style.display,
                        visibility: style.visibility,
                        pointerEvents: style.pointerEvents,
                        isVisible: style.display !== 'none' && style.visibility !== 'hidden',
                        isClickable: style.pointerEvents !== 'none' && rect.width > 0 && rect.height > 0
                    };
                })
            };
        });

        console.log('   找到 ' + buttons.count + ' 個按鈕:');
        buttons.buttons.forEach(btn => {
            console.log('   • 按鈕 ' + btn.index + ': "' + btn.text + '"');
            console.log('     - Display: ' + btn.display + ', 可見: ' + (btn.isVisible ? '✓' : '✗'));
            console.log('     - 可點擊: ' + (btn.isClickable ? '✓' : '✗'));
        });

        // =========== 測試3: 檢查小地圖 ===========
        console.log('\n✅ 測試3: 檢查小地圖');
        const minimap = await page.evaluate(() => {
            const map = document.getElementById('minimap');
            if (!map) return { exists: false };

            const style = window.getComputedStyle(map);
            const rect = map.getBoundingClientRect();

            return {
                exists: true,
                display: style.display,
                visibility: style.visibility,
                position: style.position,
                zIndex: style.zIndex,
                bottom: style.bottom,
                left: style.left,
                isVisible: style.display !== 'none' && style.visibility !== 'hidden',
                top: rect.top,
                screenLeft: rect.left,
                width: rect.width,
                height: rect.height
            };
        });

        console.log('   小地圖檢查結果:');
        console.log('   • 存在: ' + (minimap.exists ? '✓' : '✗'));
        if (minimap.exists) {
            console.log('   • 可見: ' + (minimap.isVisible ? '✓ 是' : '✗ 否'));
            console.log('   • Position: ' + minimap.position);
            console.log('   • Z-Index: ' + minimap.zIndex);
            console.log('   • Bottom: ' + minimap.bottom + ', Left: ' + minimap.left);
            console.log('   • 屏幕位置: (' + minimap.screenLeft.toFixed(1) + ', ' + minimap.top.toFixed(1) + ')');
            console.log('   • 尺寸: ' + minimap.width + 'px × ' + minimap.height + 'px');
        }

        // =========== 測試4: 檢查所有浮動面板 ===========
        console.log('\n✅ 測試4: 檢查所有浮動面板');
        const floatingPanels = await page.evaluate(() => {
            const panels = document.querySelectorAll('.floating-panel');
            return {
                count: panels.length,
                panels: Array.from(panels).map(panel => {
                    const style = window.getComputedStyle(panel);
                    const id = panel.id;
                    const rect = panel.getBoundingClientRect();
                    return {
                        id: id,
                        position: style.position,
                        display: style.display,
                        zIndex: style.zIndex,
                        isVisible: style.display !== 'none' && style.visibility !== 'hidden',
                        screenTop: rect.top,
                        screenLeft: rect.left,
                        screenRight: rect.right,
                        screenBottom: rect.bottom,
                        inViewport: rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth
                    };
                })
            };
        });

        console.log('   找到 ' + floatingPanels.count + ' 個浮動面板:');
        floatingPanels.panels.forEach(panel => {
            console.log('   • ' + (panel.id || '(無ID)'));
            console.log('     - Position: ' + panel.position + ', Z-Index: ' + panel.zIndex);
            console.log('     - 可見: ' + (panel.isVisible ? '✓' : '✗') + ', 在視口: ' + (panel.inViewport ? '✓' : '✗'));
            console.log('     - 屏幕位置: (' + panel.screenLeft.toFixed(1) + ', ' + panel.screenTop.toFixed(1) + ') → (' + panel.screenRight.toFixed(1) + ', ' + panel.screenBottom.toFixed(1) + ')');
        });

        // 保存截圖
        console.log('\n📸 保存測試截圖...');
        await page.screenshot({ path: path.join(__dirname, 'test-control-panel.png'), fullPage: false });
        console.log('   ✅ 已保存到 test-control-panel.png');

        // 最終報告
        console.log('\n' + '='.repeat(70));
        console.log('🎉 控制面板可見性測試完成！');
        console.log('='.repeat(70));

        if (controlPanel.exists && controlPanel.isVisible && controlPanel.isInViewport) {
            console.log('\n✅ 控制面板狀態: 正常 - 已正確顯示在右下角');
        } else if (controlPanel.exists && controlPanel.isVisible && !controlPanel.isInViewport) {
            console.log('\n⚠️ 控制面板狀態: 存在但超出視口');
        } else if (controlPanel.exists && !controlPanel.isVisible) {
            console.log('\n❌ 控制面板狀態: 存在但隱藏 (display:none 或 visibility:hidden)');
        } else {
            console.log('\n❌ 控制面板狀態: 不存在');
        }

    } catch (err) {
        console.error('❌ 測試失敗:', err.message);
    } finally {
        await browser.close();
    }
}

testControlPanel().catch(console.error);
