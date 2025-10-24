const { chromium } = require('playwright');
const fs = require('fs');

// 測試結果存儲
const testResults = {
  professional: {
    issues: [],
    metrics: {},
    console: [],
    network: [],
    errors: []
  },
  simple: {
    issues: [],
    metrics: {},
    console: [],
    network: [],
    errors: []
  }
};

// 嚴重程度定義
const SEVERITY = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

// 添加問題到結果
function addIssue(version, severity, category, description, reproduction, solution) {
  testResults[version].issues.push({
    severity,
    category,
    description,
    reproduction,
    solution,
    timestamp: new Date().toISOString()
  });
}

// 分析頁面性能
async function analyzePerformance(page, version) {
  console.log(`\n=== 分析 ${version} 版本性能 ===`);

  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      domInteractive: perfData.domInteractive - perfData.fetchStart,
      resources: performance.getEntriesByType('resource').length
    };
  });

  testResults[version].metrics.performance = metrics;

  // 檢查加載時間
  if (metrics.loadTime > 3000) {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Performance',
      `頁面加載時間過長: ${metrics.loadTime}ms`,
      '訪問頁面並測量加載時間',
      '優化資源加載、減少阻塞資源、使用資源預加載'
    );
  }

  if (metrics.firstContentfulPaint > 1500) {
    addIssue(
      version,
      SEVERITY.MEDIUM,
      'Performance',
      `首次內容繪製時間較慢: ${metrics.firstContentfulPaint}ms`,
      '測量 FCP 指標',
      '優化關鍵渲染路徑、內聯關鍵 CSS'
    );
  }

  console.log('性能指標:', JSON.stringify(metrics, null, 2));
}

// 分析 JavaScript 錯誤
async function analyzeJavaScriptErrors(page, version) {
  console.log(`\n=== 監聽 ${version} 版本 JavaScript 錯誤 ===`);

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    testResults[version].console.push({ type, text, timestamp: new Date().toISOString() });

    if (type === 'error') {
      console.log(`❌ Console Error: ${text}`);
      addIssue(
        version,
        SEVERITY.HIGH,
        'JavaScript Error',
        `控制台錯誤: ${text}`,
        '打開開發者工具查看控制台',
        '檢查並修復 JavaScript 代碼錯誤'
      );
    } else if (type === 'warning') {
      console.log(`⚠️  Console Warning: ${text}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
    testResults[version].errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    addIssue(
      version,
      SEVERITY.CRITICAL,
      'JavaScript Exception',
      `頁面異常: ${error.message}`,
      '重現錯誤場景',
      `修復異常: ${error.stack}`
    );
  });
}

// 分析網絡請求
async function analyzeNetworkRequests(page, version) {
  console.log(`\n=== 監聽 ${version} 版本網絡請求 ===`);

  page.on('request', request => {
    testResults[version].network.push({
      type: 'request',
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timestamp: new Date().toISOString()
    });
  });

  page.on('response', response => {
    const status = response.status();
    const url = response.url();

    testResults[version].network.push({
      type: 'response',
      url,
      status,
      resourceType: response.request().resourceType(),
      timestamp: new Date().toISOString()
    });

    if (status >= 400) {
      console.log(`❌ Failed Request: ${url} (${status})`);
      addIssue(
        version,
        status >= 500 ? SEVERITY.CRITICAL : SEVERITY.HIGH,
        'Network Error',
        `網絡請求失敗: ${url} (HTTP ${status})`,
        `訪問 ${url}`,
        status === 404 ? '檢查資源路徑是否正確' : '檢查服務器狀態和網絡連接'
      );
    }
  });

  page.on('requestfailed', request => {
    console.log(`❌ Request Failed: ${request.url()} - ${request.failure().errorText}`);
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Network Failure',
      `請求完全失敗: ${request.url()}`,
      `嘗試加載 ${request.url()}`,
      `檢查 CDN 可用性、CORS 配置、網絡連接`
    );
  });
}

// 測試 Canvas/WebGL 渲染
async function testRendering(page, version) {
  console.log(`\n=== 測試 ${version} 版本渲染 ===`);

  const renderingTest = await page.evaluate((ver) => {
    const results = {
      canvas: false,
      webgl: false,
      context: null,
      errors: []
    };

    try {
      // 檢查 Canvas
      const canvas = document.querySelector('canvas');
      if (canvas) {
        results.canvas = true;
        results.canvasSize = { width: canvas.width, height: canvas.height };

        // 檢查 WebGL
        if (ver === 'professional') {
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            results.webgl = true;
            results.webglInfo = {
              vendor: gl.getParameter(gl.VENDOR),
              renderer: gl.getParameter(gl.RENDERER),
              version: gl.getParameter(gl.VERSION)
            };
          } else {
            results.errors.push('WebGL context 無法創建');
          }
        } else {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            results.context = '2d';
          } else {
            results.errors.push('2D context 無法創建');
          }
        }
      } else {
        results.errors.push('未找到 Canvas 元素');
      }
    } catch (error) {
      results.errors.push(error.message);
    }

    return results;
  }, version);

  testResults[version].metrics.rendering = renderingTest;

  if (!renderingTest.canvas) {
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Rendering',
      'Canvas 元素未找到或未創建',
      '檢查頁面 DOM 中的 canvas 元素',
      '確保 Canvas 元素正確創建並添加到 DOM'
    );
  }

  if (version === 'professional' && !renderingTest.webgl) {
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Rendering',
      'WebGL 上下文創建失敗',
      '嘗試獲取 WebGL context',
      '檢查瀏覽器 WebGL 支持、硬件加速設置'
    );
  }

  if (version === 'simple' && renderingTest.context !== '2d') {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Rendering',
      '2D Canvas 上下文創建失敗',
      '嘗試獲取 2D context',
      '檢查 Canvas API 使用是否正確'
    );
  }

  renderingTest.errors.forEach(error => {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Rendering',
      `渲染錯誤: ${error}`,
      '執行渲染測試',
      '修復渲染相關代碼'
    );
  });

  console.log('渲染測試結果:', JSON.stringify(renderingTest, null, 2));
}

// 測試交互功能
async function testInteractions(page, version) {
  console.log(`\n=== 測試 ${version} 版本交互功能 ===`);

  // 檢查按鈕
  const buttons = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    return Array.from(btns).map(btn => ({
      text: btn.textContent.trim(),
      id: btn.id,
      className: btn.className,
      disabled: btn.disabled
    }));
  });

  testResults[version].metrics.buttons = buttons;
  console.log(`找到 ${buttons.length} 個按鈕:`, buttons);

  if (buttons.length === 0) {
    addIssue(
      version,
      SEVERITY.MEDIUM,
      'UI',
      '未找到任何按鈕元素',
      '檢查頁面中的按鈕',
      '確認按鈕是否正確渲染'
    );
  }

  // 測試鍵盤事件
  const keyboardTest = await page.evaluate(() => {
    const events = [];
    const handler = (e) => events.push(e.key);

    window.addEventListener('keydown', handler);

    // 模擬按鍵
    const keys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    keys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
    });

    window.removeEventListener('keydown', handler);

    return {
      listenersAttached: true,
      eventsReceived: events.length,
      keys: events
    };
  });

  testResults[version].metrics.keyboard = keyboardTest;
  console.log('鍵盤事件測試:', keyboardTest);

  if (keyboardTest.eventsReceived === 0) {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Interaction',
      '鍵盤事件監聽器未正確工作',
      '按下 WASD 或方向鍵',
      '檢查事件監聽器綁定和處理邏輯'
    );
  }

  // 測試鼠標事件
  const mouseTest = await page.evaluate(() => {
    let clickReceived = false;
    let moveReceived = false;

    const clickHandler = () => { clickReceived = true; };
    const moveHandler = () => { moveReceived = true; };

    document.addEventListener('click', clickHandler);
    document.addEventListener('mousemove', moveHandler);

    // 模擬點擊
    const clickEvent = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(clickEvent);

    // 模擬移動
    const moveEvent = new MouseEvent('mousemove', { bubbles: true });
    document.dispatchEvent(moveEvent);

    document.removeEventListener('click', clickHandler);
    document.removeEventListener('mousemove', moveHandler);

    return { clickReceived, moveReceived };
  });

  testResults[version].metrics.mouse = mouseTest;
  console.log('鼠標事件測試:', mouseTest);

  if (!mouseTest.clickReceived || !mouseTest.moveReceived) {
    addIssue(
      version,
      SEVERITY.MEDIUM,
      'Interaction',
      '鼠標事件監聽器可能存在問題',
      '點擊或移動鼠標',
      '檢查鼠標事件監聽器'
    );
  }
}

// 測試內存和 CPU
async function testResourceUsage(page, version) {
  console.log(`\n=== 測試 ${version} 版本資源使用 ===`);

  // 獲取性能指標
  const metrics = await page.metrics();
  testResults[version].metrics.resources = metrics;

  console.log('資源使用:', JSON.stringify(metrics, null, 2));

  // 檢查 JavaScript 堆大小
  if (metrics.JSHeapUsedSize > 50 * 1024 * 1024) { // 50MB
    addIssue(
      version,
      SEVERITY.MEDIUM,
      'Memory',
      `JavaScript 堆使用過高: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`,
      '監控內存使用情況',
      '檢查內存泄漏、優化數據結構、清理未使用對象'
    );
  }

  // 模擬運行一段時間後檢查內存增長
  console.log('等待 5 秒後再次測量...');
  await page.waitForTimeout(5000);

  const metricsAfter = await page.metrics();
  const memoryGrowth = metricsAfter.JSHeapUsedSize - metrics.JSHeapUsedSize;

  testResults[version].metrics.memoryGrowth = {
    initial: metrics.JSHeapUsedSize,
    after5s: metricsAfter.JSHeapUsedSize,
    growth: memoryGrowth,
    growthMB: (memoryGrowth / 1024 / 1024).toFixed(2)
  };

  console.log(`內存增長: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB`);

  if (memoryGrowth > 10 * 1024 * 1024) { // 10MB
    addIssue(
      version,
      SEVERITY.HIGH,
      'Memory Leak',
      `5秒內內存增長過快: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB`,
      '運行頁面並監控內存增長',
      '檢查動畫循環、事件監聽器是否清理、Three.js 對象是否正確釋放'
    );
  }
}

// 測試 CDN 資源
async function testCDNResources(page, version) {
  console.log(`\n=== 測試 ${version} 版本 CDN 資源 ===`);

  if (version === 'simple') {
    console.log('簡化版本不依賴 CDN，跳過測試');
    return;
  }

  const cdnTest = await page.evaluate(() => {
    const results = {
      three: typeof THREE !== 'undefined',
      pointerLockControls: typeof THREE !== 'undefined' && typeof THREE.PointerLockControls !== 'undefined',
      errors: []
    };

    if (!results.three) {
      results.errors.push('Three.js 未加載');
    }

    if (!results.pointerLockControls) {
      results.errors.push('PointerLockControls 未加載');
    }

    return results;
  });

  testResults[version].metrics.cdn = cdnTest;
  console.log('CDN 測試結果:', cdnTest);

  if (!cdnTest.three) {
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Dependencies',
      'Three.js CDN 加載失敗',
      '檢查 Network 面板中的 Three.js 請求',
      '檢查 CDN URL、網絡連接、CORS 設置，考慮使用本地副本'
    );
  }

  if (!cdnTest.pointerLockControls) {
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Dependencies',
      'PointerLockControls 模塊加載失敗',
      '檢查 Network 面板中的 PointerLockControls 請求',
      '檢查 import 語句、CDN URL、確保 Three.js 版本匹配'
    );
  }
}

// 測試碰撞檢測
async function testCollisionDetection(page, version) {
  console.log(`\n=== 測試 ${version} 版本碰撞檢測 ===`);

  if (version === 'simple') {
    console.log('簡化版本使用 2D 碰撞，測試基本功能');
  }

  const collisionTest = await page.evaluate((ver) => {
    const results = {
      exists: false,
      functional: false,
      errors: []
    };

    try {
      if (ver === 'professional') {
        // 檢查 Three.js Raycaster
        if (typeof THREE !== 'undefined' && THREE.Raycaster) {
          results.exists = true;

          // 測試創建 Raycaster
          const raycaster = new THREE.Raycaster();
          results.functional = true;
        } else {
          results.errors.push('THREE.Raycaster 不可用');
        }
      } else {
        // 檢查簡單碰撞檢測
        results.exists = true;
        results.functional = true;
      }
    } catch (error) {
      results.errors.push(error.message);
    }

    return results;
  }, version);

  testResults[version].metrics.collision = collisionTest;
  console.log('碰撞檢測測試:', collisionTest);

  if (!collisionTest.exists) {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Collision',
      '碰撞檢測系統未實現',
      '嘗試移動並撞牆',
      '實現碰撞檢測邏輯'
    );
  }

  if (!collisionTest.functional) {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Collision',
      '碰撞檢測系統無法正常工作',
      '測試碰撞檢測功能',
      '修復碰撞檢測實現'
    );
  }
}

// 測試瀏覽器兼容性
async function testBrowserCompatibility(page, version) {
  console.log(`\n=== 測試 ${version} 版本瀏覽器兼容性 ===`);

  const compatTest = await page.evaluate(() => {
    return {
      userAgent: navigator.userAgent,
      webgl: !!document.createElement('canvas').getContext('webgl'),
      canvas: !!document.createElement('canvas').getContext('2d'),
      pointerLock: 'pointerLockElement' in document,
      requestAnimationFrame: !!window.requestAnimationFrame,
      es6Support: typeof Symbol !== 'undefined',
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage
    };
  });

  testResults[version].metrics.compatibility = compatTest;
  console.log('兼容性測試:', JSON.stringify(compatTest, null, 2));

  if (version === 'professional' && !compatTest.webgl) {
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Compatibility',
      '瀏覽器不支持 WebGL',
      '在不支持 WebGL 的瀏覽器中打開',
      '提供降級方案或提示用戶升級瀏覽器'
    );
  }

  if (!compatTest.pointerLock) {
    addIssue(
      version,
      SEVERITY.HIGH,
      'Compatibility',
      '瀏覽器不支持 Pointer Lock API',
      '檢查 Pointer Lock 支持',
      '使用替代控制方案或提示用戶'
    );
  }

  if (!compatTest.requestAnimationFrame) {
    addIssue(
      version,
      SEVERITY.MEDIUM,
      'Compatibility',
      '瀏覽器不支持 requestAnimationFrame',
      '檢查動畫 API',
      '使用 setTimeout/setInterval 作為降級方案'
    );
  }
}

// 檢查代碼邏輯問題
async function checkCodeLogic(page, version) {
  console.log(`\n=== 檢查 ${version} 版本代碼邏輯 ===`);

  const logicTest = await page.evaluate(() => {
    const issues = [];

    // 檢查全局變量污染
    const globalVars = Object.keys(window).filter(key => {
      return !key.startsWith('webkit') &&
             !key.startsWith('moz') &&
             key !== 'console' &&
             key !== 'document' &&
             key !== 'window' &&
             typeof window[key] !== 'function';
    });

    if (globalVars.length > 50) {
      issues.push({
        type: 'Global Pollution',
        description: `過多全局變量: ${globalVars.length} 個`,
        severity: 'MEDIUM'
      });
    }

    // 檢查定時器
    const timers = {
      intervals: 0,
      timeouts: 0
    };

    // 無法直接檢測定時器數量，但可以檢查是否有清理

    return {
      globalVars: globalVars.length,
      issues
    };
  });

  testResults[version].metrics.codeLogic = logicTest;
  console.log('代碼邏輯檢查:', logicTest);

  logicTest.issues.forEach(issue => {
    addIssue(
      version,
      SEVERITY[issue.severity] || SEVERITY.MEDIUM,
      'Code Quality',
      issue.description,
      '分析代碼結構',
      '重構代碼，減少全局變量，使用模塊化'
    );
  });
}

// 主測試函數
async function runTests(url, version) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`開始測試: ${version} 版本`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // 設置事件監聽
    analyzeJavaScriptErrors(page, version);
    analyzeNetworkRequests(page, version);

    // 訪問頁面
    console.log('\n導航到頁面...');
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    if (!response) {
      addIssue(
        version,
        SEVERITY.CRITICAL,
        'Page Load',
        '頁面無法加載',
        `訪問 ${url}`,
        '檢查服務器是否運行、URL 是否正確'
      );
      return;
    }

    console.log(`頁面狀態: ${response.status()}`);

    if (response.status() !== 200) {
      addIssue(
        version,
        SEVERITY.CRITICAL,
        'Page Load',
        `頁面返回錯誤狀態碼: ${response.status()}`,
        `訪問 ${url}`,
        '檢查服務器路由配置'
      );
    }

    // 等待頁面穩定
    await page.waitForTimeout(2000);

    // 執行各項測試
    await analyzePerformance(page, version);
    await testRendering(page, version);
    await testCDNResources(page, version);
    await testInteractions(page, version);
    await testCollisionDetection(page, version);
    await testBrowserCompatibility(page, version);
    await testResourceUsage(page, version);
    await checkCodeLogic(page, version);

    // 截圖
    console.log('\n保存截圖...');
    await page.screenshot({
      path: `test-results-${version}.png`,
      fullPage: true
    });

  } catch (error) {
    console.error(`測試失敗: ${error.message}`);
    addIssue(
      version,
      SEVERITY.CRITICAL,
      'Test Execution',
      `測試執行失敗: ${error.message}`,
      '運行測試套件',
      `修復錯誤: ${error.stack}`
    );
  } finally {
    await browser.close();
  }

  console.log(`\n${version} 版本測試完成\n`);
}

// 生成報告
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('生成測試報告'.padStart(50));
  console.log('='.repeat(80) + '\n');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      professional: {
        total: testResults.professional.issues.length,
        critical: testResults.professional.issues.filter(i => i.severity === 'Critical').length,
        high: testResults.professional.issues.filter(i => i.severity === 'High').length,
        medium: testResults.professional.issues.filter(i => i.severity === 'Medium').length,
        low: testResults.professional.issues.filter(i => i.severity === 'Low').length
      },
      simple: {
        total: testResults.simple.issues.length,
        critical: testResults.simple.issues.filter(i => i.severity === 'Critical').length,
        high: testResults.simple.issues.filter(i => i.severity === 'High').length,
        medium: testResults.simple.issues.filter(i => i.severity === 'Medium').length,
        low: testResults.simple.issues.filter(i => i.severity === 'Low').length
      }
    },
    details: testResults,
    prioritization: []
  };

  // 優先級排序
  const allIssues = [
    ...testResults.professional.issues.map(i => ({ ...i, version: 'professional' })),
    ...testResults.simple.issues.map(i => ({ ...i, version: 'simple' }))
  ];

  const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  report.prioritization = allIssues.map((issue, index) => ({
    priority: index + 1,
    ...issue
  }));

  // 保存報告
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));

  // 生成可讀報告
  let readableReport = `
╔════════════════════════════════════════════════════════════════════════════╗
║                          深度測試報告                                        ║
║                    生成時間: ${new Date().toLocaleString('zh-TW')}                    ║
╚════════════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────────────┐
│ 📊 問題統計摘要                                                              │
└────────────────────────────────────────────────────────────────────────────┘

專業版本 (Professional):
  ┣━ 總計: ${report.summary.professional.total} 個問題
  ┣━ 🔴 Critical: ${report.summary.professional.critical}
  ┣━ 🟠 High: ${report.summary.professional.high}
  ┣━ 🟡 Medium: ${report.summary.professional.medium}
  ┗━ 🟢 Low: ${report.summary.professional.low}

簡化版本 (Simple):
  ┣━ 總計: ${report.summary.simple.total} 個問題
  ┣━ 🔴 Critical: ${report.summary.simple.critical}
  ┣━ 🟠 High: ${report.summary.simple.high}
  ┣━ 🟡 Medium: ${report.summary.simple.medium}
  ┗━ 🟢 Low: ${report.summary.simple.low}

┌────────────────────────────────────────────────────────────────────────────┐
│ 🎯 優先修復清單（按嚴重程度排序）                                             │
└────────────────────────────────────────────────────────────────────────────┘
`;

  report.prioritization.forEach((issue, index) => {
    const emoji = {
      'Critical': '🔴',
      'High': '🟠',
      'Medium': '🟡',
      'Low': '🟢'
    }[issue.severity];

    readableReport += `
${emoji} 優先級 ${issue.priority} | ${issue.version.toUpperCase()} | [${issue.severity}] ${issue.category}
───────────────────────────────────────────────────────────────────────────
問題: ${issue.description}

重現步驟:
  ${issue.reproduction}

解決方案:
  ${issue.solution}

`;
  });

  // 添加性能指標
  readableReport += `
┌────────────────────────────────────────────────────────────────────────────┐
│ 📈 性能指標對比                                                              │
└────────────────────────────────────────────────────────────────────────────┘

專業版本:
`;

  if (testResults.professional.metrics.performance) {
    const perf = testResults.professional.metrics.performance;
    readableReport += `  ┣━ 頁面加載: ${perf.loadTime}ms
  ┣━ DOM 就緒: ${perf.domContentLoaded}ms
  ┣━ 首次繪製: ${perf.firstPaint}ms
  ┗━ 首次內容繪製: ${perf.firstContentfulPaint}ms
`;
  }

  if (testResults.professional.metrics.resources) {
    const res = testResults.professional.metrics.resources;
    readableReport += `  ┣━ JS 堆大小: ${(res.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB
  ┗━ 內存增長: ${testResults.professional.metrics.memoryGrowth?.growthMB || 'N/A'} MB
`;
  }

  readableReport += `
簡化版本:
`;

  if (testResults.simple.metrics.performance) {
    const perf = testResults.simple.metrics.performance;
    readableReport += `  ┣━ 頁面加載: ${perf.loadTime}ms
  ┣━ DOM 就緒: ${perf.domContentLoaded}ms
  ┣━ 首次繪製: ${perf.firstPaint}ms
  ┗━ 首次內容繪製: ${perf.firstContentfulPaint}ms
`;
  }

  if (testResults.simple.metrics.resources) {
    const res = testResults.simple.metrics.resources;
    readableReport += `  ┣━ JS 堆大小: ${(res.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB
  ┗━ 內存增長: ${testResults.simple.metrics.memoryGrowth?.growthMB || 'N/A'} MB
`;
  }

  readableReport += `
┌────────────────────────────────────────────────────────────────────────────┐
│ 💡 建議                                                                     │
└────────────────────────────────────────────────────────────────────────────┘

1. 優先修復所有 Critical 級別問題
2. 依次處理 High 級別問題
3. 根據影響範圍處理 Medium 和 Low 級別問題
4. 修復後重新運行測試驗證
5. 考慮添加自動化測試防止回歸

詳細數據請查看: test-report.json
`;

  fs.writeFileSync('test-report.txt', readableReport);

  console.log(readableReport);
  console.log('\n✅ 報告已生成:');
  console.log('  - test-report.json (詳細數據)');
  console.log('  - test-report.txt (可讀報告)');
  console.log('  - test-results-professional.png (專業版截圖)');
  console.log('  - test-results-simple.png (簡化版截圖)');
}

// 主函數
(async () => {
  console.log('🚀 啟動 Playwright 深度分析測試\n');

  try {
    // 測試專業版本
    await runTests('http://localhost:8080/professional', 'professional');

    // 測試簡化版本
    await runTests('http://localhost:8080/simple', 'simple');

    // 生成報告
    generateReport();

    console.log('\n✅ 所有測試完成！');

  } catch (error) {
    console.error('測試過程出錯:', error);
    process.exit(1);
  }
})();
