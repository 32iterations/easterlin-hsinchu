# 🚀 快速開始 - 赤土崎多功能館 3D FPS 導覽系統

## ⚡ 一鍵啟動 (30 秒)

### 方式 1: PowerShell

```powershell
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化
npm start
```

然後在瀏覽器打開: **http://localhost:8080**

### 方式 2: CMD

```cmd
cd C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化
npm start
```

---

## 🎮 首次使用

1. **打開網址**: http://localhost:8080
2. **看到建築**? ✅ 成功！
3. **試試外部視角**: 用滑鼠轉動建築
4. **進入內部**: 點擊「內部導覽」按鈕
5. **第一人稱體驗**: 點擊「第一人稱」按鈕，然後按 WASD 移動

---

## 🎯 三種視角速查

| 模式 | 按鈕 | 操作 |
|------|------|------|
| **外部視角** | 外部視角 | 滑鼠拖動旋轉 |
| **內部導覽** | 內部導覽 | WASD 環繞 + 點擊房間 |
| **第一人稱** | 第一人稱 | W/A/S/D 移動 + 滑鼠看向 |

---

## 📱 可用 URL

```
主頁 (專業版 FPS 完整實現)
http://localhost:8080

完全獨立版 (備選 Canvas 2D)
http://localhost:8080/standalone

原始版 (需網路)
http://localhost:8080/original
```

---

## ⌨️ 核心快捷鍵

```
W      向前
S      向後
A      向左
D      向右
滑鼠   看向 + 轉身
點擊   鎖定滑鼠
ESC    釋放滑鼠
```

---

## 🔧 遇到問題？

### 伺服器無法啟動
```bash
# 清除 npm 快取
npm cache clean --force

# 重新安裝依賴
npm install

# 重新啟動
npm start
```

### 8080 埠口被佔用
```bash
# 查找佔用的程序
netstat -ano | findstr :8080

# 關閉程序 (替換 PID)
taskkill /PID <PID> /F
```

### 瀏覽器顯示空白
1. 重新整理頁面 (F5)
2. 清除快取 (Ctrl+Shift+Delete)
3. 開啟開發者工具 (F12) 檢查錯誤
4. 確認 Three.js CDN 可訪問

---

## 📊 系統需求

- **瀏覽器**: Chrome, Firefox, Safari (支援 WebGL)
- **Node.js**: v14.0.0 或更新
- **npm**: v6.0.0 或更新
- **RAM**: 至少 512MB 可用
- **GPU**: 建議有獨立顯卡

---

## ✨ 亮點特性

- ✅ 完整 FPS 第一人稱視角
- ✅ 實時碰撞檢測
- ✅ 49 間房間詳細資訊
- ✅ 專業 UI/UX 設計
- ✅ Cyberpunk 美學
- ✅ 流暢 60 FPS 性能

---

## 📞 幫助

點擊畫面右下角的「⚙️ 控制」面板中的「幫助」按鈕

---

**祝你享受 3D 導覽體驗！** 🎮🏢✨
