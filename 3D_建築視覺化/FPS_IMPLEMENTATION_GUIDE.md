# 🎮 赤土崎多功能館 FPS 3D 導覽系統 - 完整實現指南

**版本**: 2.0.0 (專業版 - 完整 FPS)
**更新時間**: 2025-10-24
**狀態**: ✅ 完全實現且可運作

---

## 📋 功能總覽

該系統提供了一個沉浸式的 3D 建築導覽體驗，包含三種完整實現的視角模式：

### 三種視角模式

#### 1️⃣ **外部視角 (Exterior View)**
- 🔄 自動旋轉軌道相機
- 🏢 360度觀看建築外觀
- 🎯 可縮放和平移
- **操作**: 滑鼠左鍵拖動旋轉 | 滾輪縮放 | 右鍵拖動平移

#### 2️⃣ **內部導覽 (Interior Orbit View)**
- 🏠 進入建築內部結構
- 📍 環繞房間轉動視角
- 📊 實時房間資訊面板
- **操作**: 滑鼠左鍵拖動旋轉 | 滾輪縮放 | 點擊房間查詳情

#### 3️⃣ **第一人稱視角 (FPS Mode)**
- 👁️ 身臨其境的沉浸式體驗
- 🚶 WASD 移動控制
- 🎯 滑鼠自由轉身看向
- 🔒 Pointer Lock 控制
- 🛑 完整碰撞檢測
- **操作**: W/A/S/D 移動 | 滑鼠轉身 | 點擊畫面鎖定滑鼠

---

## 🚀 快速開始

### 啟動伺服器

```bash
# 1. 進入目錄
cd "C:\Users\thc1006\Desktop\dev\easterlin-hsinchu\3D_建築視覺化"

# 2. 安裝依賴（首次執行）
npm install

# 3. 啟動伺服器
npm start
```

### 在瀏覽器中開啟

打開以下 URL：

```
http://localhost:8080
```

---

## 🎮 控制說明

### 通用控制

| 功能 | 快捷鍵 |
|------|--------|
| 切換外部視角 | 點擊「外部視角」按鈕 |
| 切換內部導覽 | 點擊「內部導覽」按鈕 |
| 切換第一人稱 | 點擊「第一人稱」按鈕 |
| 查看幫助 | 點擊「幫助」按鈕 |
| 線框顯示 | 點擊「線框」按鈕 |
| 自動旋轉 | 點擊「自動旋轉」按鈕 |
| 重置視角 | 點擊「重置視角」按鈕 |

### 外部視角控制

```
滑鼠左鍵 + 拖動  → 旋轉視角
滑鼠滾輪      → 放大/縮小
滑鼠右鍵 + 拖動  → 平移視角
雙擊         → 自動旋轉開啟/關閉
```

### 內部導覽控制

```
滑鼠左鍵 + 拖動  → 旋轉視角
滑鼠滾輪      → 放大/縮小
點擊樓層按鈕    → 選擇樓層
點擊房間列表    → 查看房間詳情
```

### 第一人稱視角控制

```
W           → 向前移動
S           → 向後移動
A           → 向左移動
D           → 向右移動
滑鼠移動    → 轉身/改變視向
點擊畫面    → 鎖定滑鼠指標(Pointer Lock)
ESC         → 釋放滑鼠指標
```

---

## 🏗️ 技術架構

### 核心技術棧

- **3D 引擎**: Three.js r128
- **相機控制**: OrbitControls + PointerLockControls
- **伺服器**: Node.js + Express
- **物理碰撞**: Raycaster-based 碰撞檢測
- **UI/UX**: CSS Glass-morphism + Cyberpunk 設計系統

### 檔案結構

```
3D_建築視覺化/
├── 赤土崎多功能館_專業版_完整內部規劃.html  (主程式 - FPS 完整實現)
├── 赤土崎多功能館_完全獨立版.html            (備選 - Canvas 2D 版)
├── 赤土崎多功能館_地理整合_完整版.html       (原始版 - 需網路)
├── server.js                                 (Express 伺服器)
├── package.json                              (NPM 設定)
└── FPS_IMPLEMENTATION_GUIDE.md               (本檔案)
```

### 相機系統架構

```
THREE.Scene
├── orbitCamera (PerspectiveCamera) - 軌道視角
│   └── OrbitControls
│       ├── 外部視角 (自動旋轉)
│       └── 內部視角 (手動控制)
│
├── fpsCamera (PerspectiveCamera) - 第一人稱視角
│   └── PointerLockControls
│       └── WASD 移動 + 滑鼠轉身
│
└── scene.children (所有物體)
    ├── building (建築網格)
    ├── ground (地面)
    └── lights (光源)
```

---

## 🎯 主要功能實現

### 1. 三相機系統

```javascript
// 外部視角相機 (80, 60, 80)
orbitCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

// 第一人稱視角相機 (0, 1.6, 10) - 模擬人眼高度
fpsCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

// 動態切換控制器
function switchMode(mode) {
    if (mode === 'exterior') {
        orbitControls.object = orbitCamera;
        orbitControls.autoRotate = true;
    } else if (mode === 'interior') {
        orbitControls.object = fpsCamera;
        orbitControls.autoRotate = false;
    } else if (mode === 'fps') {
        pointerLockControls.lock();
    }
}
```

### 2. WASD 鍵盤控制

```javascript
const moveVector = { forward: false, backward: false, left: false, right: false };
const FPS_SPEED = 0.15;  // 移動速度

function onKeyDown(event) {
    switch (event.key.toLowerCase()) {
        case 'w': moveVector.forward = true; break;
        case 's': moveVector.backward = true; break;
        case 'a': moveVector.left = true; break;
        case 'd': moveVector.right = true; break;
    }
}

function updateFPSMovement() {
    // 計算移動方向 + 旋轉應用
    // 執行碰撞檢測
    // 更新相機位置
}
```

### 3. 碰撞檢測系統

```javascript
const raycaster = new THREE.Raycaster();
const checkDistance = 0.5; // 碰撞檢測距離

// 在每個移動幀中執行
raycaster.set(cameraPos, moveDirection);
const intersects = raycaster.intersectObjects(scene.children, true);

// 如果沒有碰撞，才允許移動
if (intersects.length === 0 || intersects[0].distance > checkDistance) {
    camera.position.add(moveVector);
}
```

### 4. 房間資料系統

```javascript
const ROOM_DATA = {
    'B1': [
        { id: 'B1-01', name: '停車場', x: 0, z: 0, w: 28, d: 16, area: 448, type: 'facility', equipment: ['停車位×60', '感測系統'] },
        // ... 更多房間
    ],
    '1F': [ /* 8 間房間 */ ],
    '2F': [ /* 8 間房間 */ ],
    '3F': [ /* 7 間房間 */ ],
    '4F': [ /* 8 間房間 */ ],
    '5F': [ /* 7 間房間 */ ],
    '6F': [ /* 6 間房間 */ ]
};
```

**總計**: 49 個房間 / 7 個樓層 / 3,833 m² 建築面積

### 5. 專業 UI/UX 系統

**設計系統**: Glass-morphism + Cyberpunk

```css
/* 顏色系統 */
Primary:    #00ff88  (霓虹綠)
Secondary:  #ff00ff  (紫紅)
Tertiary:   #00ccff  (青藍)
Warning:    #ffaa00  (橙黃)
Background: #0a0e27  (深藍)

/* 佈局系統 */
3-Panel Layout (桌面)
┌─────────────────────┐
│  Navigation Bar     │  60px
├─────────────────────┤
│280│                 │320│
│ px │  3D Canvas      │ px│
│    │  (1fr flexible) │   │
└─────────────────────┘

Responsive (行動)
單欄布局，堆疊式組件
```

---

## 📊 建築規格

### 基本尺寸

| 項目 | 數值 |
|------|------|
| 基地面積 | 8,000 m² |
| 建築面積 | 3,833 m² |
| 建築寬度 | 32 m |
| 建築深度 | 20 m |
| 總高度 | 26.5 m |
| 樓層數 | 7 (B1-6F) |

### 樓層配置

| 樓層 | 功能 | 房間數 | 特色 |
|------|------|--------|------|
| **B1** | 停車場+機房 | 5 | 地下停車×60位 |
| **1F** | 長照+AI記憶 | 8 | 失智症專區、AI投影 |
| **2F** | 托嬰+監測 | 8 | SIDS監測系統 |
| **3F** | 親子共學 | 7 | 故事劇場、時間銀行 |
| **4F** | VR教室 | 8 | 沉浸式 VR、機器人區 |
| **5F** | 綠能+培訓 | 7 | 太陽能面板、綠屋頂 |
| **6F** | 會議廳 | 6 | 300人會議廳、露臺 |

---

## 🔍 效能指標

### 預期效能

```
FPS:      60 FPS (穩定)
記憶體:   約 50-80 MB
Objects:  ~150-200 個網格
Lights:   3 個主要光源
Shadows:  PCF Soft Shadows
```

### 優化技術

- ✅ 共享材質系統
- ✅ Shadow Map 緩存
- ✅ 選擇性物體更新
- ✅ 延遲渲染
- ✅ LOD 考量（未來擴展）

---

## 🐛 故障排除

### 問題 1: FPS 模式滑鼠不動

**原因**: Pointer Lock 未啟用

**解決**:
1. 確保在 FPS 模式下
2. 點擊 3D 畫面區域
3. 看到「鎖定」指標後滑鼠才能控制
4. 按 ESC 釋放

### 問題 2: 移動卡頓

**原因**: 碰撞檢測過於嚴格

**解決**:
```javascript
// 調整檢測距離 (server.js 中)
const checkDistance = 0.5;  // 改為 0.3 或 0.7
```

### 問題 3: 相機穿過牆壁

**原因**: 碰撞檢測未啟用

**解決**: 檢查 updateFPSMovement() 是否被調用
```javascript
// 確保在 animate() 中調用
if (currentMode === 'fps') {
    updateFPSMovement();  // 必須有此行
}
```

### 問題 4: 房間資訊不顯示

**原因**: UI 更新延遲

**解決**: 重新開啟瀏覽器或清除快取
```bash
# Windows: Ctrl + Shift + Delete
# Mac:     Cmd + Shift + Delete
```

---

## 🎓 開發者指南

### 添加新房間

在 `ROOM_DATA` 中添加新房間：

```javascript
'1F': [
    // 新房間範例
    {
        id: '1F-09',
        name: '新房間名稱',
        x: 5, z: 3,           // 相對座標 (相對建築中心)
        w: 4, d: 3,           // 寬度 x 深度 (公尺)
        area: 12,             // 面積 (m²)
        type: 'education',    // 房間類型
        equipment: ['設備1', '設備2']  // 設備列表
    }
]
```

### 修改碰撞檢測靈敏度

```javascript
const FPS_SPEED = 0.15;        // 移動速度 (改為 0.1-0.3)
const checkDistance = 0.5;     // 碰撞距離 (改為 0.3-0.8)
const FPS_HEIGHT = 1.6;        // 人眼高度 (標準 1.6m)
```

### 添加新光源

```javascript
function setupLighting() {
    // 添加點光源
    const pointLight = new THREE.PointLight(0xff0000, 1, 50);
    pointLight.position.set(10, 5, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);
}
```

### 自訂房間顏色

```javascript
// 修改 createBuilding() 函式中的顏色陣列
const colors = [
    0x7a7a7a,  // B1 - 改為你想要的顏色
    0x9a9a9a,  // 1F
    // ...
];
```

---

## 📚 API 端點

### REST API

```bash
# 獲取樓層資訊
GET http://localhost:8080/api/floors

# 獲取建築規格
GET http://localhost:8080/api/building

# 獲取檔案列表
GET http://localhost:8080/api/files

# 健康檢查
GET http://localhost:8080/health
```

### 回應範例

```json
{
  "1F": {
    "name": "1F - AI記憶重生+長照日照",
    "rooms": 8
  }
}
```

---

## 📞 常見問題

**Q: 可以在手機上使用嗎?**
A: 目前已針對桌面最佳化。手機版本需要進一步改進觸控控制和性能。

**Q: 支援其他建築嗎?**
A: 可以！修改 BUILDING_CONFIG 和 ROOM_DATA 就能套用到其他建築。

**Q: 可以匯出為其他格式嗎?**
A: Three.js 支援 glTF、OBJ 等格式。需要額外設定。

**Q: 如何改變建築顏色?**
A: 修改 createBuilding() 中的 colors 陣列即可。

---

## 🎉 完成清單

- ✅ 完整的三相機系統 (外部 + 內部軌道 + FPS)
- ✅ 第一人稱視角 (WASD + 滑鼠轉身)
- ✅ Pointer Lock 控制
- ✅ Raycaster 碰撞檢測
- ✅ 49 間房間完整資料
- ✅ 專業 UI/UX 設計
- ✅ Glass-morphism 美學
- ✅ Cyberpunk 色彩系統
- ✅ 響應式佈局
- ✅ Node.js Express 伺服器
- ✅ API 端點實現
- ✅ 完整文件

---

## 🚀 下一步改進 (建議)

1. **動畫過渡** - 相機模式間的平滑轉換 (TWEEN.js)
2. **室內細節** - 家具、照明、裝飾模型
3. **互動系統** - 可開啟的門、可按的按鈕
4. **聲效** - 背景音樂和步行音效
5. **分析** - 訪客足跡追蹤
6. **行動裝置** - 觸控和陀螺儀支援
7. **多人模式** - WebSocket 協作導覽
8. **VR 支援** - WebXR 沉浸式體驗

---

## 📝 授權

**License**: MIT
**版本**: 2.0.0
**最後更新**: 2025-10-24

---

**享受 3D 建築導覽體驗！** 🎮🏢✨

如有問題或建議，歡迎回饋！
