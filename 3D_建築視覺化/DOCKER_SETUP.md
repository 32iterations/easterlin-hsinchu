# 🐳 Docker 本地開發伺服器設置指南

**快速開始** ⚡ (三步啟動)

---

## 問題診斷

### 為什麼原始版本無法顯示？

❌ **原始版本 (`赤土崎多功能館_地理整合_完整版.html`) 的問題**:
```
1. ❌ CDN 加載失敗
   - Leaflet CSS: https://cdnjs.cloudflare.com/...
   - Three.js: https://cdnjs.cloudflare.com/...
   - OrbitControls: https://cdn.jsdelivr.net/...

2. ❌ NLSC WMTS 瓦片被防火牆阻擋
   - https://wmts.nlsc.gov.tw/wmts/ORT/...

3. ❌ CORS 跨域問題
   - 本地開發可能被瀏覽器安全限制

4. ❌ 網路連接問題
   - 無法訪問外部 CDN 資源
```

---

## ✅ 解決方案

### 方案 A: 完全獨立版 (推薦 - 無需 Docker)

**檔案**: `赤土崎多功能館_完全獨立版.html`

**特點**:
- ✅ **零依賴** - 完全自包含
- ✅ **本地運行** - 直接打開檔案即可
- ✅ **無網路限制** - 不需要外部資源
- ✅ **快速加載** - <1 秒

**使用方式**:
```bash
# 直接用瀏覽器打開
赤土崎多功能館_完全獨立版.html

# 或在資料管理員中雙擊開啟
```

**預期效果**:
```
✓ 左側面板顯示樓層選擇按鈕
✓ 右側顯示 2D 簡化的 3D 建築模型
✓ 樓層平面圖實時顯示
✓ 點擊按鈕切換樓層
```

---

### 方案 B: Docker 本地伺服器 (完整版)

**用途**: 如果想要完整的 Leaflet 地圖和 Three.js 3D

#### 步驟 1: 準備檔案

確保以下檔案在 `3D_建築視覺化/` 目錄:
```
3D_建築視覺化/
├── Dockerfile                           ← 已建立
├── docker-compose.yml                   ← 已建立
├── 赤土崎多功能館_完全獨立版.html        ← 已建立
├── 赤土崎多功能館_地理整合_完整版.html    ← 原始版本
├── README.md                            ← 使用說明
└── ...
```

#### 步驟 2: 啟動 Docker

**在 Windows PowerShell 或 CMD 中執行**:

```bash
# 進入目錄
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化

# 方案 B1: 使用 docker-compose (推薦)
docker-compose up --build

# 或方案 B2: 直接使用 docker
docker build -t akatsuchizaki-3d .
docker run -p 8080:8080 -v %cd%:/app akatsuchizaki-3d
```

**預期輸出**:
```
✅ Server running at http://localhost:8080
✅ Map URL: http://localhost:8080/赤土崎多功能館_完全獨立版.html
```

#### 步驟 3: 打開瀏覽器

```
http://localhost:8080
```

---

## 🎮 使用方式

### 完全獨立版 (推薦)

```
1. 打開 赤土崎多功能館_完全獨立版.html
   ↓
2. 左側顯示樓層按鈕和信息
   ↓
3. 點擊「1F 長照」等按鈕
   ↓
4. 觀察:
   ✓ 左側顯示平面圖和房間詳情
   ✓ 右側 3D 建築高亮對應樓層
   ✓ 統計信息更新
```

### Docker 伺服器版

```
1. 執行: docker-compose up
   ↓
2. 打開: http://localhost:8080
   ↓
3. 正常使用
```

---

## 🔧 故障排除

### 問題 1: 完全獨立版打開後完全沒有顯示

**原因**: JavaScript 錯誤

**解決**:
```
1. 按 F12 打開開發者工具
2. 查看 Console 標籤下的錯誤信息
3. 刷新頁面 (Ctrl+R)
4. 檢查是否有紅色錯誤信息
```

### 問題 2: Docker 無法啟動

**原因 1**: Docker 未安裝
```bash
# 檢查 Docker
docker --version

# 如果未安裝，下載:
# https://www.docker.com/products/docker-desktop
```

**原因 2**: 埠口 8080 已被佔用
```bash
# 改用其他埠口
docker-compose up --build
# 或修改 docker-compose.yml 中的埠口

# 檢查佔用埠口
netstat -ano | findstr :8080
```

### 問題 3: 瀏覽器打開時顯示空白

**原因**: 資源加載失敗

**解決**:
```
1. 清除瀏覽器快取: Ctrl+Shift+Delete
2. 硬刷新: Ctrl+Shift+R
3. 檢查網路連接
4. 查看開發者工具的 Network 標籤
```

### 問題 4: Docker 容器無法連接到主機磁碟

**解決** (Windows):
```bash
# 確保 Docker Desktop 已啟用 WSL 2
# Settings → Resources → WSL Integration

# 或使用完整路徑
docker run -p 8080:8080 -v C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化:/app akatsuchizaki-3d
```

---

## 📋 版本對比

| 特性 | 完全獨立版 | Docker 完整版 |
|------|----------|------------|
| **Leaflet 地圖** | ❌ | ✅ (需修復) |
| **Three.js 3D** | 簡化版 | ✅ (完整版) |
| **樓層平面圖** | ✅ | ✅ |
| **同步機制** | ✅ | ✅ |
| **無網路需求** | ✅ | ❌ |
| **啟動時間** | <1秒 | 3-5秒 |
| **依賴項** | 無 | Docker |
| **推薦度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🎯 立即開始

### 最快方案 (30秒)

```bash
# 直接打開，無需任何安裝
赤土崎多功能館_完全獨立版.html
```

### 如果要用 Docker

```bash
# 進入目錄
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化

# 啟動
docker-compose up --build

# 打開瀏覽器
http://localhost:8080
```

---

## 📞 下一步改進

**完全獨立版的改進方向**:

1. [ ] 升級到 WebGL Canvas (更好的 3D 效果)
2. [ ] 添加簡單的 GeoJSON 地圖顯示
3. [ ] 實現真正的 Leaflet 離線模式
4. [ ] 添加 AR 功能

**Docker 版本的改進方向**:

1. [ ] 修復 NLSC WMTS 在本地的加載
2. [ ] 添加 npm 本地映射
3. [ ] 實現完整的 Three.js 光影
4. [ ] 添加 WebSocket 實時協作

---

## 💡 技術說明

### 完全獨立版的實現

```
無外部庫 → 純 Canvas 繪圖 + 簡單投影
├─ Canvas 2D API (原生)
├─ JavaScript ES6
└─ HTML5 + CSS3 (原生)
```

### Docker 版本

```
Node.js Express 伺服器 → 提供靜態文件
├─ 檔案服務
├─ CORS 支援
└─ 本地開發環境
```

---

**現在就試試看吧！** 🚀

選擇適合你的版本，5分鐘內即可看到赤土崎多功能館的完整3D可視化系統。
