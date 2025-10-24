# 🚀 快速修復指南

**最後更新**: 2025-10-24
**預估修復時間**: 30 分鐘

---

## 🎯 核心問題（必須立即修復）

### 問題 1: CDN 加載失敗（專業版）
**影響**: OrbitControls 和 PointerLockControls 無法加載
**修復時間**: 5 分鐘

#### 步驟:

1. 打開文件:
   ```
   C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化\赤土崎多功能館_專業版_完整內部規劃.html
   ```

2. 找到第 483-484 行，刪除:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/controls/OrbitControls.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/three@r128/examples/js/controls/PointerLockControls.js"></script>
   ```

3. 替換為:
   ```html
   <script src="https://unpkg.com/three@0.169.0/examples/js/controls/OrbitControls.js"></script>
   <script src="https://unpkg.com/three@0.169.0/examples/js/controls/PointerLockControls.js"></script>
   ```

4. 保存文件

5. 重啟服務器:
   ```bash
   cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化
   node server.js
   ```

6. 測試: 訪問 http://localhost:8080/professional

---

### 問題 2: /simple 路由 404
**影響**: 簡化版無法訪問
**修復時間**: 10 分鐘

#### 步驟:

1. 打開文件:
   ```
   C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化\server.js
   ```

2. 找到第 48-50 行，替換為:
   ```javascript
   app.get('/simple', (req, res) => {
       const fileName = '赤土崎多功能館_簡化版_無CDN依賴.html';
       const filePath = path.join(__dirname, fileName);

       console.log(`[DEBUG] /simple 路由觸發`);
       console.log(`[DEBUG] 文件路徑: ${filePath}`);
       console.log(`[DEBUG] 文件存在: ${fs.existsSync(filePath)}`);

       if (!fs.existsSync(filePath)) {
           console.error(`[ERROR] 文件不存在: ${filePath}`);
           return res.status(404).json({
               error: 'File Not Found',
               expectedPath: filePath,
               availableFiles: fs.readdirSync(__dirname).filter(f => f.endsWith('.html'))
           });
       }

       console.log(`[SUCCESS] 提供簡化版文件`);
       res.sendFile(filePath);
   });
   ```

3. 保存文件

4. 重啟服務器 (Ctrl+C 停止，然後):
   ```bash
   node server.js
   ```

5. 測試: 訪問 http://localhost:8080/simple

6. 檢查控制台輸出，應該看到:
   ```
   [DEBUG] /simple 路由觸發
   [DEBUG] 文件路徑: C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化\赤土崎多功能館_簡化版_無CDN依賴.html
   [DEBUG] 文件存在: true
   [SUCCESS] 提供簡化版文件
   ```

---

### 問題 3: WebGL 降級方案
**影響**: 無 WebGL 支持時用戶體驗差
**修復時間**: 15 分鐘

#### 步驟:

1. 打開文件:
   ```
   C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化\赤土崎多功能館_專業版_完整內部規劃.html
   ```

2. 找到 `initThreeJS()` 函數（約第 600 行）

3. 在函數開頭添加檢查:
   ```javascript
   function initThreeJS() {
       // ========== WebGL 支持檢查 ==========
       const testCanvas = document.createElement('canvas');
       const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');

       if (!gl) {
           console.warn('⚠️ WebGL 不可用，自動跳轉簡化版');
           showFallbackNotice();
           setTimeout(() => window.location.href = '/simple', 3000);
           return;
       }

       // ========== 依賴檢查 ==========
       if (typeof THREE === 'undefined') {
           console.error('❌ Three.js 未加載');
           alert('Three.js 庫加載失敗，請刷新頁面');
           return;
       }

       if (typeof THREE.OrbitControls === 'undefined') {
           console.error('❌ OrbitControls 未加載');
           alert('OrbitControls 加載失敗，請檢查網絡連接或聯繫管理員');
           return;
       }

       if (typeof THREE.PointerLockControls === 'undefined') {
           console.warn('⚠️ PointerLockControls 未加載，FPS 模式將不可用');
       }

       // ========== 原有代碼繼續 ==========
       // ... (原始的 initThreeJS 代碼)
   }

   // 顯示降級提示
   function showFallbackNotice() {
       const notice = document.createElement('div');
       notice.id = 'webgl-fallback-notice';
       notice.style.cssText = `
           position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
           color: white; padding: 40px; border-radius: 15px;
           box-shadow: 0 10px 40px rgba(0,0,0,0.3);
           text-align: center; z-index: 9999; max-width: 500px;
           font-family: 'Microsoft JhengHei', sans-serif;
       `;
       notice.innerHTML = `
           <h2 style="margin: 0 0 15px 0; font-size: 24px;">⚠️ WebGL 不可用</h2>
           <p style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">
               您的瀏覽器不支持 WebGL 或硬件加速已禁用
           </p>
           <p style="margin: 0; font-size: 14px; opacity: 0.8;">
               正在自動跳轉到簡化版本...
           </p>
           <div style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
               3 秒後自動跳轉
           </div>
       `;
       document.body.appendChild(notice);
   }
   ```

4. 保存文件

5. 測試（在禁用 WebGL 的環境）

---

## ✅ 驗證修復

### 測試清單

```bash
# 1. 重啟服務器
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化
node server.js

# 2. 打開瀏覽器測試
```

#### 專業版 (http://localhost:8080/professional)
- [ ] 頁面加載無錯誤
- [ ] 控制台無紅色錯誤
- [ ] 看到 3D 建築模型
- [ ] 可以旋轉視角（鼠標拖拽）
- [ ] 樓層按鈕可點擊
- [ ] 視角模式可切換

#### 簡化版 (http://localhost:8080/simple)
- [ ] 頁面返回 200（非 404）
- [ ] Canvas 渲染正常
- [ ] 按鈕 UI 顯示
- [ ] 鍵盤控制有效（WASD）

---

## 🔍 故障排查

### 如果專業版仍有錯誤:

1. 打開開發者工具（F12）
2. 查看 Console 標籤
3. 查看 Network 標籤
4. 確認:
   - `OrbitControls.js` 狀態碼 200
   - `PointerLockControls.js` 狀態碼 200
   - 無 CORS 錯誤
   - 無 404 錯誤

### 如果簡化版仍是 404:

```bash
# 1. 檢查文件是否存在
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化
ls "赤土崎多功能館_簡化版_無CDN依賴.html"

# 2. 檢查服務器日誌
# 啟動服務器後，訪問 /simple，查看控制台輸出

# 3. 手動測試路由
curl -I http://localhost:8080/simple

# 4. 檢查所有可用文件
curl http://localhost:8080/api/files
```

---

## 📊 修復後性能對比

**修復前**:
- 專業版: ❌ 無法運行（CDN 失敗）
- 簡化版: ❌ 404 錯誤

**修復後**:
- 專業版: ✅ 正常運行，加載 < 2s
- 簡化版: ✅ 正常運行，加載 < 100ms

---

## 🎉 完成

修復完成後，運行完整測試:

```bash
# 重新運行 Playwright 測試
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu
node playwright-deep-analysis.js
```

應該看到:
- ✅ 專業版: 0 Critical 錯誤
- ✅ 簡化版: 0 Critical 錯誤

---

## 📞 需要幫助?

如果遇到問題:
1. 檢查服務器是否在運行（`node server.js`）
2. 檢查文件路徑是否正確
3. 查看瀏覽器開發者工具 Console
4. 查看服務器控制台輸出
5. 參考完整報告: `PLAYWRIGHT_深度分析報告.md`
