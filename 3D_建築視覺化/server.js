/**
 * 簡單的 Express 本地開發伺服器
 * 用於提供 3D 建築可視化系統
 *
 * 使用方式:
 *   node server.js
 *
 * 然後在瀏覽器打開:
 *   http://localhost:8080
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// ==================== 配置 ====================
const PORT = 8080;
const HOST = 'localhost';

// ==================== 中間件 ====================

// 靜態文件服務
app.use(express.static(path.join(__dirname)));

// 允許 CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 日誌記錄
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ==================== 路由 ====================

// 首頁 - 提供完整專業版本（3D FPS 完整實現）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '赤土崎多功能館_專業版_完整內部規劃.html'));
});

// 提供簡化版本（無CDN依賴）
app.get('/simple', (req, res) => {
    const filePath = path.join(__dirname, '赤土崎多功能館_簡化版_無CDN依賴.html');
    console.log(`[簡化版路由] 請求路徑: ${filePath}`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`[簡化版路由] 檔案不存在: ${filePath}`);
            res.status(404).json({ error: 'File not found', path: filePath });
            return;
        }
        console.log(`[簡化版路由] 檔案存在，發送中...`);
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`[簡化版路由] 發送錯誤: ${err.message}`);
            } else {
                console.log(`[簡化版路由] 成功發送`);
            }
        });
    });
});

// 提供專業版本
app.get('/professional', (req, res) => {
    res.sendFile(path.join(__dirname, '赤土崎多功能館_專業版_完整內部規劃.html'));
});

// 提供原始版本
app.get('/original', (req, res) => {
    res.sendFile(path.join(__dirname, '赤土崎多功能館_地理整合_完整版.html'));
});

// 提供完全獨立版本
app.get('/standalone', (req, res) => {
    res.sendFile(path.join(__dirname, '赤土崎多功能館_完全獨立版.html'));
});

// API: 獲取樓層信息
app.get('/api/floors', (req, res) => {
    const floorData = {
        'B1': { name: 'B1 - 停車場+機房', rooms: 5 },
        '1F': { name: '1F - AI記憶重生+長照日照', rooms: 8 },
        '2F': { name: '2F - SIDS監測+公共托嬰', rooms: 8 },
        '3F': { name: '3F - 親子共學+時間銀行', rooms: 7 },
        '4F': { name: '4F - VR共學教室+青少年', rooms: 8 },
        '5F': { name: '5F - 綠能系統+多功能培訓', rooms: 7 },
        '6F': { name: '6F - 公共會議廳+露臺', rooms: 6 }
    };
    res.json(floorData);
});

// API: 獲取建築規格
app.get('/api/building', (req, res) => {
    const buildingSpec = {
        name: '赤土崎多功能館',
        location: { lat: 24.8247, lng: 120.9456, address: '新竹市東區' },
        area: { site: '8,000 m²', building: '3,833 m²' },
        floors: { count: 7, range: 'B1-6F' },
        height: '26.5 m',
        cost: 'NT$228.7M'
    };
    res.json(buildingSpec);
});

// 健康檢查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'running', timestamp: new Date().toISOString() });
});

// 目錄列表 (用於調試)
app.get('/api/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        res.json({ files: htmlFiles });
    });
});

// ==================== 錯誤處理 ====================

// 404 處理
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `路由 ${req.url} 不存在`,
        availableRoutes: [
            'GET  / (首頁 - 專業版 FPS)',
            'GET  /professional (專業版 - 完整 FPS)',
            'GET  /standalone (完全獨立版)',
            'GET  /original (原始版)',
            'GET  /api/floors (樓層數據)',
            'GET  /api/building (建築規格)',
            'GET  /health (健康檢查)',
            'GET  /api/files (檔案列表)'
        ]
    });
});

// ==================== 啟動伺服器 ====================

app.listen(PORT, () => {
    const url = `http://${HOST}:${PORT}`;
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ 赤土崎多功能館 3D 可視化伺服器已啟動                    ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 主頁 (專業版 FPS): ${(url).padEnd(32)}║`);
    console.log(`║  📍 完全獨立版: ${(url + '/standalone').padEnd(41)}║`);
    console.log(`║  📍 原始版:    ${(url + '/original').padEnd(43)}║`);
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  API 端點:                                                 ║');
    console.log('║  • GET /api/floors       - 樓層信息                       ║');
    console.log('║  • GET /api/building     - 建築規格                       ║');
    console.log('║  • GET /api/files        - 檔案列表                       ║');
    console.log('║  • GET /health           - 健康檢查                       ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  按 Ctrl+C 停止伺服器                                       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n💡 提示: 在瀏覽器中打開上面的 URL，享受 3D 建築可視化體驗！\n');
});

// 優雅關閉
process.on('SIGINT', () => {
    console.log('\n⏹️  伺服器正在關閉...');
    process.exit(0);
});
