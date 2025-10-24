const https = require('https');
const fs = require('fs');
const path = require('path');

// Three.js library download URLs
const FILES = {
    'OrbitControls.js': 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/controls/OrbitControls.js',
    'PointerLockControls.js': 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/controls/PointerLockControls.js'
};

const LIBS_DIR = path.join(__dirname, 'libs', 'three');

// Ensure directory exists
if (!fs.existsSync(LIBS_DIR)) {
    fs.mkdirSync(LIBS_DIR, { recursive: true });
    console.log(`✅ 創建目錄: ${LIBS_DIR}`);
}

// Download each file
Object.entries(FILES).forEach(([filename, url]) => {
    const filepath = path.join(LIBS_DIR, filename);

    console.log(`📥 下載: ${filename}`);
    console.log(`   來源: ${url}`);

    https.get(url, (response) => {
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`   → 重定向到: ${response.headers.location}`);
            https.get(response.headers.location, (redirectResponse) => {
                const file = fs.createWriteStream(filepath);
                redirectResponse.pipe(file);

                file.on('finish', () => {
                    file.close();
                    const size = fs.statSync(filepath).size;
                    console.log(`✅ 已保存: ${filename} (${size} bytes)\n`);
                });

                file.on('error', (err) => {
                    fs.unlink(filepath, () => {}); // Delete file on error
                    console.error(`❌ 錯誤保存 ${filename}: ${err.message}\n`);
                });
            }).on('error', (err) => {
                console.error(`❌ 重定向下載失敗 ${filename}: ${err.message}\n`);
            });
        } else if (response.statusCode === 200) {
            const file = fs.createWriteStream(filepath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                const size = fs.statSync(filepath).size;
                console.log(`✅ 已保存: ${filename} (${size} bytes)\n`);
            });

            file.on('error', (err) => {
                fs.unlink(filepath, () => {}); // Delete file on error
                console.error(`❌ 錯誤保存 ${filename}: ${err.message}\n`);
            });
        } else {
            console.error(`❌ HTTP ${response.statusCode}: ${filename}\n`);
        }
    }).on('error', (err) => {
        console.error(`❌ 下載失敗 ${filename}: ${err.message}\n`);
    });
});

console.log('⏳ 正在下載文件...\n');
