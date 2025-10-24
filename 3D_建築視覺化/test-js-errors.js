const { chromium } = require('playwright');
const path = require('path');

async function testJSErrors() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 收集所有console消息
    const messages = [];
    page.on('console', msg => {
        messages.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location()
        });
    });

    // 收集页面错误
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.toString());
    });

    console.log('打开网站并检查错误...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    
    // 等待一段时间让脚本执行
    await page.waitForTimeout(3000);

    console.log('\n=== CONSOLE MESSAGES ===');
    messages.forEach(msg => {
        console.log(`[${msg.type}] ${msg.text}`);
    });

    console.log('\n=== PAGE ERRORS ===');
    if (errors.length === 0) {
        console.log('没有JavaScript错误');
    } else {
        errors.forEach(err => console.log(err));
    }

    await browser.close();
}

testJSErrors().catch(console.error);
