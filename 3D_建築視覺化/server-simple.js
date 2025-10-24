const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = 8080;
const HOST = 'localhost';

// 日誌中間件（在任何路由之前）
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// CORS 中間件
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ==================== 路由（NO 靜態文件中間件！）====================

// 首頁 - 專業版本
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '赤土崎多功能館_專業版_完整內部規劃.html');
    console.log(`📄 [首頁] 發送專業版本: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) console.error(`❌ 首頁發送錯誤: ${err.message}`);
        else console.log(`✅ 首頁發送成功`);
    });
});

// 簡化版本
app.get('/simple', (req, res) => {
    const filePath = path.join(__dirname, '赤土崎多功能館_簡化版_無CDN依賴.html');
    console.log(`📄 [簡化] 發送簡化版本: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) console.error(`❌ 簡化版發送錯誤: ${err.message}`);
        else console.log(`✅ 簡化版發送成功`);
    });
});

// 專業版本（顯式路由）
app.get('/professional', (req, res) => {
    const filePath = path.join(__dirname, '赤土崎多功能館_專業版_完整內部規劃.html');
    console.log(`📄 [專業] 發送專業版本: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) console.error(`❌ 專業版發送錯誤: ${err.message}`);
        else console.log(`✅ 專業版發送成功`);
    });
});

// 靜態文件（libs, etc）
app.use('/libs', express.static(path.join(__dirname, 'libs')));

// API: 健康檢查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: 'server-simple', timestamp: new Date().toISOString() });
});

// 404 處理
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`,
        availableRoutes: [
            'GET  / - Professional version (3D)',
            'GET  /professional - Explicit professional version',
            'GET  /simple - Simplified version (Canvas 2D)',
            'GET  /health - Health check',
            'GET  /libs/* - Static library files'
        ]
    });
});

// 啟動伺服器
app.listen(PORT, HOST, () => {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Server started successfully!                          ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 URL: http://${HOST}:${PORT}                                    ║`);
    console.log('║  📄 / → Professional version (3D with Three.js)           ║');
    console.log('║  📄 /simple → Simplified version (Canvas 2D)              ║');
    console.log('║  📚 /libs/* → Three.js libraries                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
});

process.on('SIGINT', () => {
    console.log('\n⏹️  Shutting down server...');
    process.exit(0);
});
