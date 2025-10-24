const https = require('https');
const fs = require('fs');

function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, { redirect: 'follow' }, (response) => {
            const file = fs.createWriteStream(filename);
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${filename} 完成 (${response.headers['content-length']} bytes)`);
                resolve();
            });
        }).on('error', reject);
    });
}

(async () => {
    try {
        await downloadFile('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js', 'OrbitControls.js');
        await downloadFile('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/PointerLockControls.js', 'PointerLockControls.js');
        console.log('✅ 所有文件下載完成');
    } catch (e) {
        console.error('❌ 下載失敗:', e.message);
    }
})();
