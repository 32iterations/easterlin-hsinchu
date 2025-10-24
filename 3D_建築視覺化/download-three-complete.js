const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Three.js from unpkg (ESM ready)
const FILES = {
    // Main three.js library
    // Note: unpkg serves three.module.js as ESM version
    'OrbitControls.js': 'https://unpkg.com/three@r160/examples/jsm/controls/OrbitControls.js',
    'PointerLockControls.js': 'https://unpkg.com/three@r160/examples/jsm/controls/PointerLockControls.js',
    // Also get the module wrapper if available
    'index.js': 'https://unpkg.com/three@r160/build/three.module.js'
};

const LIBS_DIR = path.join(__dirname, 'libs', 'three');

// Ensure directory exists
if (!fs.existsSync(LIBS_DIR)) {
    fs.mkdirSync(LIBS_DIR, { recursive: true });
    console.log(`✅ 創建目錄: ${LIBS_DIR}`);
}

function downloadFile(filename, url) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(LIBS_DIR, filename);
        console.log(`📥 下載: ${filename}`);
        console.log(`   來源: ${url}`);

        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, { redirect: 'follow' }, (response) => {
            if (response.statusCode >= 400) {
                console.error(`❌ HTTP ${response.statusCode}: ${filename}`);
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filepath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                const size = fs.statSync(filepath).size;
                console.log(`✅ 已保存: ${filename} (${size} bytes)\n`);
                resolve({ filename, size });
            });

            file.on('error', (err) => {
                fs.unlink(filepath, () => {});
                console.error(`❌ 寫入錯誤 ${filename}: ${err.message}`);
                reject(err);
            });
        }).on('error', (err) => {
            console.error(`❌ 下載失敗 ${filename}: ${err.message}`);
            reject(err);
        });
    });
}

// Download all files
(async () => {
    console.log('⏳ 正在下載 Three.js 文件...\n');

    for (const [filename, url] of Object.entries(FILES)) {
        try {
            await downloadFile(filename, url);
        } catch (err) {
            console.log(`⚠️  跳過 ${filename}: ${err.message}`);
        }
    }

    console.log('✅ 下載完成！');
})();
