const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📍 访问 http://localhost:8080');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    
    // 等待canvas渲染
    await page.waitForTimeout(2000);
    
    // 检查canvas是否有内容
    const canvasInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { found: false };
      return {
        found: true,
        width: canvas.width,
        height: canvas.height,
        offsetWidth: canvas.offsetWidth,
        offsetHeight: canvas.offsetHeight
      };
    });
    
    console.log('Canvas Info:', canvasInfo);
    
    // 拍截图
    await page.screenshot({ path: 'final-verification.png', fullPage: false });
    console.log('✅ Screenshot saved: final-verification.png');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  
  await browser.close();
})();
