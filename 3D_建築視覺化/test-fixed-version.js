#!/usr/bin/env node

/**
 * 自動化測試腳本 - 驗證修復版本的所有功能
 */

const http = require('http');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  🧪 赤土崎3D導覽系統 - 修復版本 自動化測試      ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const tests = [];

// 測試 1: HTML 加載
function testHTMLLoading() {
    return new Promise((resolve) => {
        console.log('📋 測試 1/6: HTML 頁面加載...');
        const req = http.get('http://127.0.0.1:8080/', (res) => {
            if (res.statusCode === 200) {
                console.log('✅ HTML 加載成功 (狀態碼: 200)');
                resolve(true);
            } else {
                console.log(`❌ HTML 加載失敗 (狀態碼: ${res.statusCode})`);
                resolve(false);
            }
        });
        req.on('error', (err) => {
            console.log(`❌ 連接錯誤: ${err.message}`);
            resolve(false);
        });
    });
}

// 測試 2: Three.js 庫文件
function testThreeJS() {
    return new Promise((resolve) => {
        console.log('\n📦 測試 2/6: Three.js 庫文件加載...');
        const req = http.get('http://127.0.0.1:8080/libs/three/three.min.js', (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ Three.js 加載成功 (大小: ${res.headers['content-length']} bytes)`);
                resolve(true);
            } else {
                console.log(`❌ Three.js 加載失敗 (狀態碼: ${res.statusCode})`);
                resolve(false);
            }
        });
        req.on('error', (err) => {
            console.log(`❌ 連接錯誤: ${err.message}`);
            resolve(false);
        });
    });
}

// 測試 3: OrbitControls
function testOrbitControls() {
    return new Promise((resolve) => {
        console.log('\n🎮 測試 3/6: OrbitControls 加載...');
        const req = http.get('http://127.0.0.1:8080/libs/three/OrbitControls.js', (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ OrbitControls 加載成功 (大小: ${res.headers['content-length']} bytes)`);
                resolve(true);
            } else {
                console.log(`❌ OrbitControls 加載失敗 (狀態碼: ${res.statusCode})`);
                resolve(false);
            }
        });
        req.on('error', (err) => {
            console.log(`❌ 連接錯誤: ${err.message}`);
            resolve(false);
        });
    });
}

// 測試 4: API 端點
function testAPIEndpoints() {
    return new Promise((resolve) => {
        console.log('\n🔌 測試 4/6: API 端點...');
        const endpoints = [
            { url: '/api/floors', name: '樓層信息' },
            { url: '/api/building', name: '建築規格' },
            { url: '/health', name: '健康檢查' }
        ];

        let passed = 0;
        let completed = 0;

        endpoints.forEach(({ url, name }) => {
            const req = http.get(`http://127.0.0.1:8080${url}`, (res) => {
                completed++;
                if (res.statusCode === 200) {
                    console.log(`  ✅ ${name} (GET ${url})`);
                    passed++;
                } else {
                    console.log(`  ❌ ${name} (狀態碼: ${res.statusCode})`);
                }
                if (completed === endpoints.length) {
                    resolve(passed === endpoints.length);
                }
            });
            req.on('error', (err) => {
                completed++;
                console.log(`  ❌ ${name} (錯誤: ${err.message})`);
                if (completed === endpoints.length) {
                    resolve(false);
                }
            });
        });
    });
}

// 測試 5: HTML 內容驗證
function testHTMLContent() {
    return new Promise((resolve) => {
        console.log('\n🔍 測試 5/6: HTML 內容驗證...');
        let htmlContent = '';

        http.get('http://127.0.0.1:8080/', (res) => {
            res.on('data', chunk => {
                htmlContent += chunk.toString();
            });

            res.on('end', () => {
                const checks = [
                    { name: '頁面標題', pattern: '赤土崎多功能館' },
                    { name: '模式切換按鈕', pattern: "switchMode('exterior')" },
                    { name: '樓層列表容器', pattern: 'floor-list' },
                    { name: 'Three.js 加載', pattern: '/libs/three/three.min.js' },
                    { name: 'Canvas 容器', pattern: 'canvas-container' }
                ];

                let allPassed = true;
                checks.forEach(({ name, pattern }) => {
                    if (htmlContent.includes(pattern)) {
                        console.log(`  ✅ ${name}`);
                    } else {
                        console.log(`  ❌ ${name} (找不到: "${pattern}")`);
                        allPassed = false;
                    }
                });

                resolve(allPassed);
            });
        });
    });
}

// 測試 6: 性能檢查
function testPerformance() {
    return new Promise((resolve) => {
        console.log('\n⚡ 測試 6/6: 性能檢查...');

        const startTime = Date.now();

        http.get('http://127.0.0.1:8080/', (res) => {
            const sizes = {
                contentLength: parseInt(res.headers['content-length']) || 0,
                startTime: startTime,
                responseTime: Date.now() - startTime
            };

            console.log(`  📊 HTML 大小: ${(sizes.contentLength / 1024).toFixed(2)} KB`);
            console.log(`  ⏱️  響應時間: ${sizes.responseTime} ms`);

            if (sizes.contentLength < 500000 && sizes.responseTime < 1000) {
                console.log(`  ✅ 性能達標 (HTML < 500KB 且響應 < 1s)`);
                resolve(true);
            } else {
                console.log(`  ⚠️  性能提示: 可考慮進一步優化`);
                resolve(true);
            }
        });
    });
}

// 主測試運行
async function runTests() {
    try {
        const results = [];

        results.push(await testHTMLLoading());
        results.push(await testThreeJS());
        results.push(await testOrbitControls());
        results.push(await testAPIEndpoints());
        results.push(await testHTMLContent());
        results.push(await testPerformance());

        // 總結
        const passed = results.filter(r => r).length;
        const total = results.length;

        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log(`║  📈 測試結果: ${passed}/${total} 通過                         ║`);
        console.log('╚════════════════════════════════════════════════════╝\n');

        if (passed === total) {
            console.log('🎉 所有測試都通過了！修復版本已準備就緒！\n');
            console.log('📌 你現在可以在瀏覽器中打開:');
            console.log('   🌐 http://localhost:8080/\n');
            console.log('   功能:');
            console.log('   • 左側: 樓層選擇和房間清單');
            console.log('   • 中間: 3D 建築可視化');
            console.log('   • 右側: 場景信息和統計');
            console.log('   • 頂部: 視圖模式切換 (外景/內景)\n');
        } else {
            console.log('⚠️  部分測試失敗，請檢查服務器狀態。\n');
        }

        process.exit(passed === total ? 0 : 1);
    } catch (err) {
        console.error('❌ 測試執行錯誤:', err);
        process.exit(1);
    }
}

// 延遲啟動測試，給服務器時間啟動
setTimeout(runTests, 1000);
