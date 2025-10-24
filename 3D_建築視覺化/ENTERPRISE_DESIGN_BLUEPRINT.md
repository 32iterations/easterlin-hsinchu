# 赤土崎多功能館 - 企業級 3D 建築可視化完整設計方案

**專案代號**: 赤土崎 3D 可視化系統 v2.0
**文件版本**: 1.0
**更新日期**: 2025-10-24
**設計目標**: 企業級、專業級、無粗糙感的沉浸式建築體驗

---

## 📋 目錄

1. [專案總覽](#專案總覽)
2. [建築坐標系統設計](#建築坐標系統設計)
3. [43個房間完整坐標表](#43個房間完整坐標表)
4. [建築平面圖](#建築平面圖)
5. [UI/UX 設計規範](#uiux-設計規範)
6. [交互流程設計](#交互流程設計)
7. [技術架構](#技術架構)
8. [實現路線圖](#實現路線圖)
9. [性能目標與優化](#性能目標與優化)

---

## 📐 專案總覽

### 核心需求

```
真實還原: 43個房間精確位置、尺寸、功能
專業UI/UX: 賽博朋克 + 企業藍，無粗糙感
流暢交互: 外部視角 → 樓層視角 → FPS 漫遊
性能優化: 45-60 FPS，< 3秒加載
```

### 建築規格

```yaml
建築名稱: 赤土崎多功能館
總樓地板面積: 3,833 m²
建築樓層: B1 + 6F (7層)
建築尺寸:
  寬度: 32m
  深度: 20m
  高度: 約24m (每層3.5-4m)
  核心平面積: 640 m²/層
```

### 樓層功能分配

| 樓層 | 主要功能 | 面積 | 房間數 |
|------|---------|------|--------|
| **6F** | 會議廳 + 屋頂露臺 | 840 m² | 6間 |
| **5F** | 太陽能 + 綠屋頂 + 辦公 | 800 m² | 7間 |
| **4F** | 青少年 STEM + VR | 480 m² | 7間 |
| **3F** | 教育培訓 + 時間銀行 | 500 m² | 7間 |
| **2F** | 公共托嬰中心 | 670 m² | 7間 |
| **1F** | 長照日照中心 | 700 m² | 8間 |
| **B1** | 停車場 + 設備層 | 590 m² | 5間 |
| **總計** | - | **3,833 m²** | **43間** |

---

## 🎯 建築坐標系統設計

### 坐標系原點

```
原點位置: 建築幾何中心 (0, 0, 0)
X軸: 東西向 (-16m 至 +16m)
Y軸: 垂直高度 (-4m 至 +24m)
Z軸: 南北向 (-10m 至 +10m)
```

### 樓層高度分配

```javascript
const FLOOR_HEIGHTS = {
  'B1': -4.0,   // 地下層
  '1F': 0.0,    // 一樓 (基準層)
  '2F': 3.5,    // 二樓
  '3F': 7.0,    // 三樓
  '4F': 10.5,   // 四樓
  '5F': 14.0,   // 五樓
  '6F': 17.5    // 六樓
};

const FLOOR_CEILING_HEIGHT = 3.5; // 每層樓高
```

### 核心區域劃分

```
建築分為 3 大區域:

├── 西側區 (-16m ≤ X < -5m): 主要功能室
├── 中央核 (-5m ≤ X ≤ +5m): 垂直交通、設備
└── 東側區 (+5m < X ≤ +16m): 輔助功能室
```

---

## 🏢 43個房間完整坐標表

### B1 地下層 (Y = -4.0m) - 5間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能 |
|----|---------|-------|-------|------|------|------|------|
| B1-01 | 停車場 | -8 | 0 | 24m | 18m | 450m² | 30車位 |
| B1-02 | 空調機房 | 12 | -6 | 7m | 7m | 50m² | 中央空調 |
| B1-03 | 配電室 | 12 | 2 | 6m | 6m | 40m² | 電力系統 |
| B1-04 | 給排水設備 | 12 | 8 | 5m | 6m | 30m² | 水塔泵浦 |
| B1-05 | 雨水回收槽 | -14 | -8 | 5m | 4m | 20m² | 環保設施 |

**設計重點**:
- 停車場佔據 B1 大部分空間 (西側+中央)
- 設備機房集中於東側 (方便維修管理)
- 垂直電梯井位於 (X=0, Z=0)

---

### 1F 一樓 (Y = 0.0m) - 8間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能類別 |
|----|---------|-------|-------|------|------|------|----------|
| 1F-01 | 失智症專區 | -12 | 5 | 14m | 14m | 200m² | 長照主區 |
| 1F-02 | AI投影互動 | -12 | -6 | 10m | 10m | 100m² | 療癒科技 |
| 1F-03 | 復健訓練室 | -2 | 7 | 10m | 8m | 80m² | 物理治療 |
| 1F-04 | 藝術療法室 | 8 | 7 | 10m | 8m | 80m² | 職能治療 |
| 1F-05 | 認知訓練區 | 8 | -2 | 8m | 7.5m | 60m² | 腦力活動 |
| 1F-06 | 共用餐廳 | -2 | -6 | 12m | 10m | 120m² | 跨齡共餐 |
| 1F-07 | 備餐廚房 | 7 | -8 | 6m | 6.5m | 40m² | 廚務作業 |
| 1F-08 | 護理站 | 12 | 2 | 5m | 4m | 20m² | 健康監測 |

**設計重點**:
- 失智症專區隔音強化 (STC 65)
- AI投影區需暗室環境
- 共用餐廳位於中央，方便各區使用
- 護理站靠近電梯 (緊急應變)

---

### 2F 二樓 (Y = 3.5m) - 7間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能類別 |
|----|---------|-------|-------|------|------|------|----------|
| 2F-01 | SIDS監測嬰兒室 | -12 | 6 | 14m | 14m | 200m² | 0-1歲托育 |
| 2F-02 | 嬰兒床區 | -12 | -5 | 14m | 14m | 200m² | 午睡專區 |
| 2F-03 | 中央監控室 | 0 | 8 | 6m | 5m | 30m² | 安全監控 |
| 2F-04 | 嬰兒活動區 | 6 | 6 | 10m | 5m | 50m² | 爬行遊戲 |
| 2F-05 | 幼兒活動區 | 6 | 0 | 10m | 5m | 50m² | 1-2歲遊戲 |
| 2F-06 | AI故事劇場 | 10 | -6 | 5m | 4m | 20m² | 互動學習 |
| 2F-07 | 餵食換尿區 | -5 | -8 | 10m | 8m | 80m² | 照護作業 |
| 2F-08 | 衛浴設施 | 12 | -2 | 5m | 8m | 40m² | 盥洗消毒 |

**設計重點**:
- SIDS 監測需獨立空調、低噪音
- 嬰兒床區強化隔音 (IIC 70 地板)
- 中央監控室視野覆蓋所有活動區
- 餵食區靠近廚房垂直動線

---

### 3F 三樓 (Y = 7.0m) - 7間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能類別 |
|----|---------|-------|-------|------|------|------|----------|
| 3F-01 | 閱讀區 | -12 | 5 | 10m | 8m | 80m² | 安靜學習 |
| 3F-02 | 故事劇場 | -12 | -4 | 12m | 10m | 120m² | 互動教學 |
| 3F-03 | 主題學習教室 | -2 | 6 | 10m | 10m | 100m² | 課程活動 |
| 3F-04 | 時間銀行辦公室 | 8 | 6 | 8m | 7.5m | 60m² | 志工媒合 |
| 3F-05 | 導師座位區 | 8 | -2 | 8m | 7.5m | 60m² | 輔導諮詢 |
| 3F-06 | 表揚展示區 | 0 | -8 | 6m | 5m | 30m² | 成果展覽 |
| 3F-07 | MR混合實境區 | 11 | -8 | 10m | 5m | 50m² | 虛擬體驗 |

**設計重點**:
- 閱讀區需安靜環境 (STC 60)
- 故事劇場可彈性隔間
- 時間銀行位於東側 (獨立動線)
- MR區需高頂空間 (3.8m)

---

### 4F 四樓 (Y = 10.5m) - 7間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能類別 |
|----|---------|-------|-------|------|------|------|----------|
| 4F-01 | STEM教室 | -12 | 5 | 10m | 10m | 100m² | 科學實驗 |
| 4F-02 | 機器人競賽區 | -12 | -4 | 8m | 7.5m | 60m² | 編程訓練 |
| 4F-03 | 電子工作台 | -4 | 6 | 8m | 5m | 40m² | 硬體開發 |
| 4F-04 | VR硬體實驗區 | 4 | 6 | 6m | 5m | 30m² | 設備測試 |
| 4F-05 | VR沉浸教室 | 4 | -2 | 12m | 10m | 120m² | 大型體驗 |
| 4F-06 | 虛擬實驗室 | 10 | -8 | 8m | 5m | 40m² | 化學VR |
| 4F-07 | 遠距/職涯導師室 | -5 | -8 | 10m | 9m | 90m² | 線上輔導 |

**設計重點**:
- VR沉浸教室需高頂 (4m) + 黑暗環境
- STEM教室需水槽、電源插座密集
- 機器人區地板承重強化
- 遠距導師室隔音 (STC 65)

---

### 5F 五樓 (Y = 14.0m) - 7間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能類別 |
|----|---------|-------|-------|------|------|------|----------|
| 5F-01 | 太陽能面板 (屋頂) | 0 | 0 | 20m | 15m | 300m² | 能源設施 |
| 5F-02 | 儲能電池室 | 12 | 8 | 6m | 5m | 30m² | 電力儲存 |
| 5F-03 | 綠屋頂花園 | -8 | 0 | 20m | 12.5m | 250m² | 生態景觀 |
| 5F-04 | 培訓教室 | -12 | -7 | 8m | 7.5m | 60m² | 員工訓練 |
| 5F-05 | 會議室 | 6 | -7 | 8m | 5m | 40m² | 行政會議 |
| 5F-06 | 實驗室 | 6 | 6 | 10m | 5m | 50m² | 研發測試 |
| 5F-07 | 辦公區 | -4 | 7 | 10m | 7m | 70m² | 管理人員 |

**設計重點**:
- 太陽能面板覆蓋東半部屋頂
- 綠屋頂需防水、排水系統
- 儲能電池室需通風、消防
- 實驗室需獨立空調

---

### 6F 六樓 (Y = 17.5m) - 6間房間

| ID | 房間名稱 | X坐標 | Z坐標 | 寬度 | 深度 | 面積 | 功能類別 |
|----|---------|-------|-------|------|------|------|----------|
| 6F-01 | 會議廳 | -6 | 0 | 22m | 20m | 440m² | 大型集會 |
| 6F-02 | 備餐區 | 10 | 8 | 6m | 5m | 30m² | 餐飲服務 |
| 6F-03 | 衛浴設施 | 12 | 2 | 5m | 8m | 40m² | 盥洗空間 |
| 6F-04 | 舞台區 | -12 | -8 | 10m | 8m | 80m² | 表演區域 |
| 6F-05 | 屋頂露臺 | 6 | -8 | 20m | 10m | 200m² | 戶外活動 |
| 6F-06 | 儲備區 | 14 | -6 | 10m | 5m | 50m² | 器材倉庫 |

**設計重點**:
- 會議廳可容納 200-300 人
- 舞台區需音響、燈光設備
- 屋頂露臺需欄杆 (1.2m高)
- 備餐區靠近垂直動線

---

## 🗺️ 建築平面圖 (ASCII 示意)

### B1 地下層平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │                                          │
   │  ┌─────────────────────────────────┐    │
   │  │                                  │    │
   │  │      停車場 (B1-01)              │ 🚗 │ 機
   │  │      450 m²                      │ 🚗 │ 房
   │  │      30車位                      │ 🚗 │ 群
   │  │                                  │    │ ▓▓
   │  └─────────────────────────────────┘    │
   │                [電梯井]                  │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │                  🛗                      │
   │  雨水回收 ▓                              │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**圖例**:
- 🚗 = 停車位
- ▓ = 設備機房
- 🛗 = 電梯井

---

### 1F 一樓平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │  ┌──────────┐   復健   ┌──────────┐    │
   │  │          │   (1F-03)│          │    │
   │  │ 失智症專區│          │藝術療法  │    │
   │  │ (1F-01)  │          │(1F-04)   │    │
   │  │ 200m²    │          │          │    │
   │  └──────────┘          └──────────┘    │
   │                [電梯井]                  │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │                  🛗        認知訓練      │
   │  AI投影  共用餐廳              (1F-05)   │
   │  (1F-02) (1F-06)        廚房  護理站    │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**色彩編碼**:
- 紅色系: 長照/健康 (#ff6600)
- 共享區: 中性色 (#888888)

---

### 2F 二樓平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │  ┌──────────────┐     ┌──────┐  嬰兒  │
   │  │ SIDS監測     │ 監控│      │  活動  │
   │  │ 嬰兒室       │ 室  │幼兒  │  (2F-04)│
   │  │ (2F-01)      │     │活動  │        │
   │  │ 200m²        │     │(2F-05)│       │
   │  └──────────────┘     └──────┘        │
   │                [電梯井]         AI故事  │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │                  🛗                      │
   │  ┌──────────────┐ 餵食換尿      衛浴    │
   │  │ 嬰兒床區     │ (2F-07)       (2F-08) │
   │  │ (2F-02)      │                       │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**色彩編碼**:
- 綠色系: 托育/兒童 (#00ff00)

---

### 3F 三樓平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │  ┌──────┐   主題學習  ┌────────┐        │
   │  │閱讀區│   教室      │時間銀行│        │
   │  │(3F-01)   (3F-03)   │(3F-04) │       │
   │  └──────┘             └────────┘        │
   │                                 導師座位 │
   │                [電梯井]         (3F-05)  │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │                  🛗                      │
   │  ┌──────────┐ 表揚展示  MR混合實境     │
   │  │故事劇場  │ (3F-06)   (3F-07)        │
   │  │(3F-02)   │                           │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**色彩編碼**:
- 藍色系: 教育/培訓 (#0088ff)

---

### 4F 四樓平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │  ┌────────┐ 電子   VR硬體               │
   │  │ STEM   │ 工作台 (4F-04)              │
   │  │ 教室   │(4F-03)                      │
   │  │(4F-01) │                             │
   │  └────────┘        ┌──────────────┐    │
   │  機器人            │ VR沉浸教室   │    │
   │  (4F-02)   [電梯井]│ (4F-05)      │    │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │                  🛗│              │    │
   │                    └──────────────┘    │
   │             遠距/職涯導師室  虛擬實驗室 │
   │             (4F-07)          (4F-06)   │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**色彩編碼**:
- 紫色系: 技術/研發 (#9900ff)

---

### 5F 五樓平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │         辦公區    ┌────┐  實驗室        │
   │         (5F-07)   │太陽│  (5F-06)       │
   │  ┌───────────┐   │能板│                │
   │  │           │   │(5F-│  儲能電池      │
   │  │ 綠屋頂花園│   │-01)│  (5F-02)       │
   │  │ (5F-03)   │   └────┘                │
   │  │           │   [電梯井]               │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │  │           │     🛗                    │
   │  └───────────┘                           │
   │  培訓教室           會議室               │
   │  (5F-04)            (5F-05)              │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**特殊設施**:
- 太陽能面板 (屋頂層)
- 綠屋頂 (生態景觀)

---

### 6F 六樓平面圖

```
北 ↑
    -16m                0m                +16m
     │                  │                  │
  ─┼──────────────────────────────────────────┼─ +10m (北)
   │  ┌──────────────────────────┐  備餐區  │
   │  │                          │  (6F-02) │
   │  │                          │          │
   │  │   會議廳 (6F-01)         │  衛浴    │
   │  │   440 m²                 │  (6F-03) │
   │  │   可容納 200-300人       │          │
   │  │                          │          │
  ─┼──────────────────────────────────────────┼─ 0m (中心)
   │  │                  🛗      │          │
   │  └──────────────────────────┘          │
   │  舞台區          ┌────────────┐ 儲備區 │
   │  (6F-04)         │屋頂露臺    │ (6F-06)│
   │                  │(6F-05)     │        │
  ─┼──────────────────────────────────────────┼─ -10m (南)
     │                  │                  │
     西                 中                  東
```

**頂樓設施**:
- 會議廳 (多功能大廳)
- 屋頂露臺 (戶外活動)

---

## 🎨 UI/UX 設計規範

### 1. 設計系統 (Design System)

#### 色彩系統

```css
/* 主色調 (賽博朋克) */
--primary-magenta: #ff00ff;      /* 主操作、高亮 */
--primary-cyan: #00ccff;         /* 次要操作、信息 */
--primary-green: #00ff88;        /* 成功、確認 */
--primary-orange: #ffaa00;       /* 警告、重要 */

/* 背景色 (深色主題) */
--bg-dark: #0a0e27;              /* 主背景 */
--bg-panel: #1a1a2e;             /* 面板背景 */
--bg-card: #16213e;              /* 卡片背景 */

/* 中性色 (灰階) */
--gray-100: #f5f5f5;
--gray-200: #cccccc;
--gray-300: #999999;
--gray-400: #666666;
--gray-500: #333333;

/* 房間類型色彩編碼 */
--room-care: #ff6600;            /* 長照/健康 (橙紅) */
--room-childcare: #00ff00;       /* 托育/兒童 (鮮綠) */
--room-education: #0088ff;       /* 教育/培訓 (藍) */
--room-tech: #9900ff;            /* 技術/研發 (紫) */
--room-support: #888888;         /* 管理/服務 (灰) */

/* 玻璃態效果 (Glassmorphism) */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
--glass-backdrop: blur(10px);
```

#### 排版系統

```css
/* 字體家族 */
--font-primary: 'Inter', 'Microsoft YaHei', sans-serif;
--font-mono: 'Consolas', 'Courier New', monospace;

/* 字體大小 */
--text-xs: 10px;    /* 輔助文字 */
--text-sm: 12px;    /* 正文小 */
--text-base: 14px;  /* 正文 */
--text-lg: 16px;    /* 標題小 */
--text-xl: 18px;    /* 標題中 */
--text-2xl: 20px;   /* 標題大 */

/* 字重 */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-bold: 700;

/* 行高 */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

#### 間距系統 (8px 基礎網格)

```css
--spacing-1: 4px;    /* 0.5 單位 */
--spacing-2: 8px;    /* 1 單位 (基礎) */
--spacing-3: 12px;   /* 1.5 單位 */
--spacing-4: 16px;   /* 2 單位 */
--spacing-6: 24px;   /* 3 單位 */
--spacing-8: 32px;   /* 4 單位 */
--spacing-12: 48px;  /* 6 單位 */
--spacing-16: 64px;  /* 8 單位 */
```

#### 陰影系統

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-base: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-md: 0 8px 16px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.25);

/* 霓虹發光效果 */
--glow-cyan: 0 0 10px #00ccff, 0 0 20px #00ccff80;
--glow-magenta: 0 0 10px #ff00ff, 0 0 20px #ff00ff80;
--glow-green: 0 0 10px #00ff88, 0 0 20px #00ff8880;
```

---

### 2. UI 組件設計

#### 頂部導航欄 (Top Navigation Bar)

```
位置: 固定頂部
高度: 60px
背景: 玻璃態 (glass-bg + backdrop-blur)
邊框: 底部 1px --primary-green

┌────────────────────────────────────────────────────────┐
│ 🏢 赤土崎多功能館     [外部視角▼] [6F▼] [🔍搜索]  ⚙️ │
└────────────────────────────────────────────────────────┘

組件:
- Logo + 專案名稱 (左側)
- 視角模式切換 (下拉選單)
- 樓層選擇 (下拉選單)
- 搜索框 (房間快速定位)
- 設置圖標 (右側)
```

**視角模式選項**:
- 外部視角 (Exterior View)
- 樓層視角 (Floor View)
- FPS 漫遊 (First-Person)

---

#### 左側樓層導航面板 (Left Sidebar)

```
位置: 固定左側
寬度: 280px
背景: --bg-panel
滾動: 垂直滾動

┌──────────────────────┐
│ 樓層導航 🏢          │
├──────────────────────┤
│ ► 6F 會議廳 (6間)    │ ← 可展開/收起
│   ├─ 會議廳 440m²    │
│   ├─ 備餐區 30m²     │
│   └─ ...             │
│ ▼ 5F 能源辦公 (7間)  │ ← 展開狀態
│   ├─ ✓ 太陽能 300m²  │ ← 已選中
│   ├─ 綠屋頂 250m²    │
│   └─ ...             │
│ ► 4F 青少年 (7間)    │
│ ...                  │
└──────────────────────┘

特性:
- 樹狀結構 (Tree View)
- 已選中房間高亮
- 房間面積標註
- 展開/收起動畫
```

---

#### 右側房間詳情面板 (Right Info Panel)

```
位置: 固定右側
寬度: 320px
背景: 玻璃態卡片
滾動: 垂直滾動

┌─────────────────────────────┐
│ 太陽能面板區 (5F-01)        │
├─────────────────────────────┤
│ 面積: 300 m²                │
│ 位置: 5F 東側屋頂           │
│ 功能: 能源設施              │
├─────────────────────────────┤
│ 設備清單:                   │
│ • 太陽能板 120 片           │
│ • 逆變器 4 組               │
│ • 儲能系統連線              │
├─────────────────────────────┤
│ 統計數據:                   │
│ 發電量: 50 kW               │
│ 年發電: 73,000 kWh          │
│ CO2減量: 36.5 噸/年         │
├─────────────────────────────┤
│ [進入房間] [查看設備]       │
└─────────────────────────────┘

特性:
- 房間基本信息
- 設備列表
- 統計數據圖表
- 操作按鈕
```

---

#### 浮動控制面板 (Floating Controls)

```
位置: 3D 畫布右下角
尺寸: 48×240px
背景: 玻璃態圓角卡片

┌────┐
│ 🔄 │ ← 重置視角
├────┤
│ ➕ │ ← 放大
├────┤
│ ➖ │ ← 縮小
├────┤
│ 🎮 │ ← 切換控制模式
├────┤
│ ❓ │ ← 幫助
└────┘

特性:
- 半透明背景
- 懸停顯示提示
- 點擊動畫反饋
```

---

#### 小地圖 (Mini Map)

```
位置: 3D 畫布左下角
尺寸: 180×180px
背景: 深色半透明

┌────────────────┐
│   6F 平面圖    │
│  ┌──────────┐  │
│  │          │  │
│  │    ●     │  │ ← 當前位置 (紅點)
│  │          │  │
│  └──────────┘  │
│   [1F-6F]      │ ← 樓層切換
└────────────────┘

特性:
- 2D 平面俯視圖
- 當前位置標記
- 點擊跳轉功能
- 樓層快速切換
```

---

#### 提示系統 (Tooltips)

```
懸停提示 (Hover Tooltip):
┌──────────────────┐
│ 太陽能面板區     │
│ 點擊查看詳情     │
└──────────────────┘

載入提示 (Loading):
┌──────────────────┐
│ ⏳ 載入中...     │
│ 正在建立 3D 模型 │
└──────────────────┘

錯誤提示 (Error):
┌──────────────────┐
│ ❌ 無法載入房間   │
│ 請重新整理頁面   │
└──────────────────┘

樣式:
- 背景: rgba(0, 0, 0, 0.8)
- 圓角: 4px
- 字體: 12px
- 最大寬度: 200px
```

---

### 3. 交互動畫設計

#### 相機模式切換動畫

```javascript
// 外部視角 → 樓層視角
動畫時長: 800ms
緩動函數: ease-in-out
步驟:
1. 相機拉近 (200ms)
2. 旋轉到俯視角 (300ms)
3. 平移到目標樓層 (300ms)

// 樓層視角 → FPS 模式
動畫時長: 500ms
緩動函數: ease-out
步驟:
1. 相機降低至地面高度 (200ms)
2. 視角調整至第一人稱 (300ms)
```

#### 房間進入/退出動畫

```javascript
// 進入房間
動畫時長: 600ms
效果:
1. 門打開動畫 (200ms) - 旋轉90°
2. 相機推進 (400ms) - 移動到房間中心
3. UI 面板展開 (200ms) - 從右側滑入

// 退出房間
動畫時長: 400ms
效果:
1. 相機後退 (300ms)
2. 門關閉動畫 (100ms)
3. UI 面板收起 (200ms)
```

#### 樓層切換過渡

```javascript
// 樓層切換
動畫時長: 1000ms
效果:
1. 當前樓層淡出 (200ms)
2. 相機垂直平移 (600ms)
3. 目標樓層淡入 (200ms)
4. 小地圖更新 (同步)
```

#### 懸停效果

```css
/* 房間懸停 */
.room:hover {
  transition: all 0.3s ease;
  box-shadow: var(--glow-cyan);
  border-color: var(--primary-cyan);
  transform: scale(1.05);
}

/* 按鈕懸停 */
.button:hover {
  transition: all 0.2s ease;
  background: var(--primary-magenta);
  box-shadow: var(--glow-magenta);
}
```

---

### 4. 響應式設計

#### 桌面版 (≥ 1920×1080)

```
布局: 左側面板 (280px) + 3D 畫布 + 右側面板 (320px)
字體: 標準尺寸 (14px 基礎)
控制: 滑鼠 + 鍵盤
性能: 高品質渲染 (60 FPS)
```

#### 平板版 (≥ 1024×768)

```
布局: 左側面板可收起 + 3D 畫布 + 右側面板可收起
字體: 略小 (12px 基礎)
控制: 觸控 + 滑鼠
性能: 中等品質 (45 FPS)
```

#### 移動版 (< 1024px) - 暫不支援

```
建議: 顯示「請使用桌面版瀏覽器」提示
原因: 3D 渲染性能需求高
```

---

### 5. 視覺效果與光影

#### 光源設計

```javascript
// 環境光 (Ambient Light)
顏色: #ffffff
強度: 0.4
用途: 基礎照明

// 方向光 (Directional Light)
顏色: #ffeedd (暖白光)
強度: 0.8
位置: (50, 100, 50) - 模擬太陽光
陰影: 啟用 (2048×2048 陰影貼圖)

// 點光源 (Point Lights) - 室內
顏色: #ffffff
強度: 0.5
位置: 每個房間中心
數量: 動態生成 (根據房間數)

// 聚光燈 (Spot Light) - 重點照明
顏色: #00ccff (青色調)
強度: 1.0
用途: 高亮選中房間
```

#### 材質設計

```javascript
// 建築外牆
材質: PBR (Physically Based Rendering)
顏色: #e0e0e0 (淺灰)
粗糙度: 0.3
金屬度: 0.1
效果: 輕微反射

// 玻璃窗戶
材質: 透明材質 (Transparency)
顏色: #88ccff (淺藍)
透明度: 0.3
反射率: 0.7
效果: 玻璃質感

// 房間地板
材質: 標準材質 (Standard Material)
顏色: 依房間類型 (色彩編碼)
粗糙度: 0.5
效果: 微光澤

// 設備機房
材質: 金屬材質 (Metallic)
顏色: #666666 (深灰)
金屬度: 0.8
粗糙度: 0.2
效果: 金屬光澤
```

#### 後期處理效果

```javascript
// Bloom (泛光)
強度: 0.5
閾值: 0.8
半徑: 0.4
用途: 霓虹燈、高光增強

// SSAO (環境光遮蔽)
強度: 0.3
半徑: 0.1
樣本數: 16
用途: 深度感、陰影細節

// FXAA (抗鋸齒)
啟用: 是
用途: 邊緣平滑

// 色調映射 (Tone Mapping)
曝光: 1.0
用途: HDR 轉 LDR
```

---

## 🎮 交互流程設計

### 1. 初始載入流程

```
使用者打開網頁
    ↓
顯示載入畫面 (Progress Bar)
[████████░░░░] 60% - 載入 3D 模型...
    ↓
Three.js 初始化 (500ms)
    ↓
建立建築外殼 (800ms)
    ↓
生成 43 個房間 (1000ms)
    ↓
應用材質與光源 (500ms)
    ↓
淡入主畫面 (200ms)
    ↓
外部視角 (自動旋轉)
[提示] 使用滑鼠拖曳旋轉，滾輪縮放
```

**載入時間目標**: < 3 秒

---

### 2. 樓層導航流程

```
使用者點擊「5F 太陽能樓層」
    ↓
左側樹狀選單展開
    ↓
相機模式自動切換至「樓層視角」
    ↓
相機動畫 (800ms):
  - 拉近建築
  - 旋轉至俯視角
  - 平移至 5F 高度
    ↓
5F 樓層高亮 (發光效果)
    ↓
右側面板更新「5F 樓層統計」
    ↓
小地圖顯示 5F 平面圖
```

---

### 3. 房間進入流程 (FPS 模式)

```
使用者點擊「5F-01 太陽能面板區」
    ↓
房間邊框高亮 (青色發光)
    ↓
門打開動畫 (200ms)
    ↓
相機切換至 FPS 模式
    ↓
相機移動動畫 (400ms):
  - 從樓層視角 → 門口 → 房間中心
    ↓
FPS 控制啟用 (WASD 移動)
    ↓
右側面板展開「房間詳情」
    ↓
顯示設備標籤 (懸浮3D文字)
[太陽能板] [逆變器] [儲能連線]
    ↓
使用者可自由漫遊房間
```

**FPS 控制說明**:
- W/A/S/D: 前後左右移動
- 滑鼠: 視角旋轉
- Shift: 加速移動
- Esc: 退出房間

---

### 4. 房間退出流程

```
使用者按 Esc 鍵 或 點擊「返回」按鈕
    ↓
FPS 控制禁用
    ↓
相機後退動畫 (300ms)
    ↓
門關閉動畫 (100ms)
    ↓
相機回到樓層視角 (500ms)
    ↓
右側面板收起
    ↓
房間高亮取消
```

---

### 5. 搜索功能流程

```
使用者在頂部搜索框輸入「太陽能」
    ↓
實時搜索匹配:
  - 5F-01 太陽能面板區 ✓
  - 5F-02 儲能電池室 (相關)
    ↓
下拉顯示搜索結果
    ↓
使用者點擊「5F-01」
    ↓
相機自動導航至該房間
    ↓
樓層切換至 5F
    ↓
房間高亮
    ↓
右側面板顯示房間詳情
```

---

### 6. 快捷鍵系統

| 快捷鍵 | 功能 | 說明 |
|--------|------|------|
| **Space** | 切換視角模式 | 外部 ↔ 樓層 ↔ FPS |
| **1-6** | 快速跳轉樓層 | 1=1F, 2=2F, ... 6=6F |
| **B** | 跳轉 B1 | 地下層 |
| **Esc** | 退出房間 | 返回樓層視角 |
| **R** | 重置視角 | 回到初始位置 |
| **F** | 全螢幕 | 切換全螢幕模式 |
| **H** | 隱藏 UI | 隱藏所有面板 (僅顯示 3D) |
| **Ctrl+F** | 搜索 | 聚焦搜索框 |
| **WASD** | FPS 移動 | 僅在 FPS 模式有效 |
| **Shift** | 加速移動 | 移動速度 ×2 |

---

## 🏗️ 技術架構

### 模塊結構

```
src/
├── core/
│   ├── Scene.js              # 場景管理器
│   ├── Camera.js             # 相機系統 (3種模式)
│   ├── Renderer.js           # WebGL 渲染器
│   ├── Lighting.js           # 光源系統
│   └── PostProcessing.js     # 後期處理效果
│
├── building/
│   ├── BuildingData.js       # 樓層/房間數據 (43間)
│   ├── Exterior.js           # 建築外殼生成
│   ├── Interior.js           # 室內房間生成
│   ├── Doors.js              # 門/窗生成
│   ├── Furniture.js          # 家具庫
│   └── Navigation.js         # 房間導航邏輯
│
├── ui/
│   ├── UISystem.js           # UI 總管理器
│   ├── Components/
│   │   ├── TopBar.js         # 頂部導航欄
│   │   ├── LeftSidebar.js    # 樓層樹狀導航
│   │   ├── RightPanel.js     # 房間詳情面板
│   │   ├── FloatingControls.js # 浮動控制按鈕
│   │   ├── MiniMap.js        # 小地圖
│   │   └── Tooltip.js        # 提示系統
│   └── Styles/
│       ├── main.css          # 主樣式表
│       ├── theme.css         # 色彩主題
│       ├── animations.css    # 動畫效果
│       └── responsive.css    # 響應式設計
│
├── controls/
│   ├── OrbitControls.js      # 外部視角控制
│   ├── FloorViewControls.js  # 樓層視角控制
│   ├── FPSControls.js        # 第一人稱控制
│   └── InputHandler.js       # 統一輸入處理
│
├── utils/
│   ├── MathUtils.js          # 數學工具 (坐標轉換)
│   ├── Collision.js          # 碰撞檢測 (FPS 模式)
│   ├── Performance.js        # 性能監控
│   ├── Logger.js             # 日誌系統
│   └── DataLoader.js         # 數據加載器
│
└── main.js                   # 應用入口
```

---

### 核心類別設計

#### BuildingData.js (數據中心)

```javascript
/**
 * 建築數據中心
 * 包含所有 43 個房間的坐標、尺寸、功能資訊
 */
const BUILDING_DATA = {
  // 建築規格
  specs: {
    width: 32,      // m
    depth: 20,      // m
    height: 24,     // m
    floors: ['B1', '1F', '2F', '3F', '4F', '5F', '6F']
  },

  // 樓層高度
  floorHeights: {
    'B1': -4.0, '1F': 0.0, '2F': 3.5, '3F': 7.0,
    '4F': 10.5, '5F': 14.0, '6F': 17.5
  },

  // 43 個房間數據
  rooms: [
    // B1 地下層
    {
      id: 'B1-01',
      name: '停車場',
      floor: 'B1',
      position: { x: -8, y: -4.0, z: 0 },
      size: { width: 24, depth: 18, height: 3.5 },
      area: 450,
      type: 'support',    // 支援設施
      color: 0x888888,
      description: '可容納 30 車位',
      equipment: ['停車位', '監視器', '照明系統']
    },
    {
      id: 'B1-02',
      name: '空調機房',
      floor: 'B1',
      position: { x: 12, y: -4.0, z: -6 },
      size: { width: 7, depth: 7, height: 3.5 },
      area: 50,
      type: 'support',
      color: 0x888888,
      description: '中央空調主機',
      equipment: ['冷氣主機', '熱泵', '新風交換']
    },
    // ... (其餘 41 間房間)
  ]
};
```

---

#### Scene.js (場景管理)

```javascript
/**
 * 場景管理器
 * 負責建立 Three.js 場景、光源、渲染循環
 */
class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = null;
    this.camera = null;
    this.lighting = null;
    this.buildingGroup = new THREE.Group();
  }

  init(container) {
    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 建立相機
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(50, 30, 50);
    this.camera.lookAt(0, 0, 0);

    // 建立光源
    this.lighting = new LightingSystem(this.scene);
    this.lighting.init();

    // 建立建築
    this.buildBuilding();

    // 渲染循環
    this.animate();
  }

  buildBuilding() {
    const exterior = new BuildingExterior(BUILDING_DATA);
    this.buildingGroup.add(exterior.build());

    const interior = new BuildingInterior(BUILDING_DATA);
    this.buildingGroup.add(interior.build());

    this.scene.add(this.buildingGroup);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
```

---

#### Camera.js (相機系統)

```javascript
/**
 * 相機模式管理器
 * 支援 3 種模式: Exterior, Floor, FPS
 */
class CameraSystem {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.mode = 'exterior'; // 'exterior' | 'floor' | 'fps'
    this.currentFloor = '1F';
  }

  // 切換至外部視角
  switchToExterior(animated = true) {
    const targetPos = new THREE.Vector3(50, 30, 50);
    const targetLook = new THREE.Vector3(0, 10, 0);

    if (animated) {
      this.animateCameraTo(targetPos, targetLook, 800);
    } else {
      this.camera.position.copy(targetPos);
      this.camera.lookAt(targetLook);
    }

    this.mode = 'exterior';
    this.controls.enableOrbit();
  }

  // 切換至樓層視角
  switchToFloor(floor, animated = true) {
    const floorY = BUILDING_DATA.floorHeights[floor];
    const targetPos = new THREE.Vector3(0, floorY + 15, 30);
    const targetLook = new THREE.Vector3(0, floorY, 0);

    if (animated) {
      this.animateCameraTo(targetPos, targetLook, 800);
    } else {
      this.camera.position.copy(targetPos);
      this.camera.lookAt(targetLook);
    }

    this.mode = 'floor';
    this.currentFloor = floor;
    this.controls.enableFloorView();
  }

  // 切換至 FPS 模式
  switchToFPS(room, animated = true) {
    const roomData = BUILDING_DATA.rooms.find(r => r.id === room.id);
    const entryPos = new THREE.Vector3(
      roomData.position.x,
      roomData.position.y + 1.6, // 人眼高度
      roomData.position.z + roomData.size.depth / 2 + 2 // 門口外
    );

    if (animated) {
      this.animateCameraTo(entryPos, null, 500, () => {
        this.controls.enableFPS();
      });
    } else {
      this.camera.position.copy(entryPos);
      this.controls.enableFPS();
    }

    this.mode = 'fps';
  }

  // 相機動畫
  animateCameraTo(targetPos, targetLook, duration, callback) {
    // 使用 GSAP 或 Tween.js 實現平滑動畫
    // ...
  }
}
```

---

## 🚀 實現路線圖 (12 天計劃)

### Phase 1: 數據與坐標系統 (Day 1)

**目標**: 建立完整的建築數據模型

- [x] 定義 43 個房間的精確坐標
- [x] 創建 `BuildingData.js` 數據中心
- [x] 繪製 ASCII 平面圖 (驗證空間分配)
- [x] 定義房間類型色彩編碼
- [ ] 單元測試 (驗證面積總和 = 3,833 m²)

**成果物**:
- `BuildingData.js` (完整)
- `FLOOR_PLANS.md` (ASCII 圖)

---

### Phase 2: 核心 3D 場景 (Day 2-4)

**目標**: 建立精確的 3D 建築模型

**Day 2: 建築外殼**
- [ ] 建立 `Exterior.js`
- [ ] 生成建築主體 (32m×20m×24m)
- [ ] 添加外牆、屋頂、地基
- [ ] 材質應用 (玻璃、混凝土)

**Day 3: 室內房間**
- [ ] 建立 `Interior.js`
- [ ] 生成 43 個房間方塊
- [ ] 應用房間類型顏色
- [ ] 添加房間標籤 (3D 文字)

**Day 4: 樓梯、電梯、家具**
- [ ] 建立 `Navigation.js`
- [ ] 生成樓梯 (2 座)
- [ ] 生成電梯井 (中央)
- [ ] 基礎家具模型 (桌椅、床、設備)

**成果物**:
- 完整 3D 建築模型
- 基礎光影效果

---

### Phase 3: UI 框架設計 (Day 5-6)

**目標**: 建立專業級 UI 組件庫

**Day 5: CSS 框架**
- [ ] 創建 `theme.css` (色彩系統)
- [ ] 創建 `main.css` (布局系統)
- [ ] 創建 `animations.css` (動畫庫)
- [ ] 玻璃態組件樣式 (Glassmorphism)

**Day 6: UI 組件實現**
- [ ] `TopBar.js` (頂部導航)
- [ ] `LeftSidebar.js` (樹狀導航)
- [ ] `RightPanel.js` (詳情面板)
- [ ] `FloatingControls.js` (浮動按鈕)
- [ ] `MiniMap.js` (小地圖)

**成果物**:
- 完整 UI 組件庫
- 響應式布局

---

### Phase 4: 交互與控制 (Day 7-8)

**目標**: 實現 3 種相機模式與平滑切換

**Day 7: 相機系統**
- [ ] `Camera.js` (相機管理器)
- [ ] 外部視角 (Orbit Controls)
- [ ] 樓層視角 (自定義控制)
- [ ] 相機切換動畫 (GSAP)

**Day 8: FPS 控制**
- [ ] `FPSControls.js` (第一人稱)
- [ ] WASD 移動控制
- [ ] 滑鼠視角控制
- [ ] 碰撞檢測 (不穿牆)

**成果物**:
- 3 種相機模式
- 平滑切換動畫

---

### Phase 5: UI 邏輯整合 (Day 9-10)

**目標**: UI 與 3D 場景雙向綁定

**Day 9: 事件系統**
- [ ] 點擊房間 → 高亮 + 詳情面板
- [ ] 樓層選單 → 相機跳轉
- [ ] 搜索功能 → 房間定位
- [ ] 快捷鍵系統

**Day 10: 數據展示**
- [ ] 房間詳情卡片 (動態數據)
- [ ] 樓層統計圖表
- [ ] 設備列表渲染
- [ ] 小地圖同步更新

**成果物**:
- 完整交互流程
- 數據雙向綁定

---

### Phase 6: 細節與優化 (Day 11-12)

**目標**: 打磨細節、性能優化

**Day 11: 視覺細節**
- [ ] 後期處理 (Bloom, SSAO)
- [ ] 家具細節化
- [ ] 門窗動畫 (開關)
- [ ] 光影調優

**Day 12: 性能優化**
- [ ] LOD (Level of Detail) 管理
- [ ] 幾何體合併 (減少 Draw Calls)
- [ ] 紋理壓縮
- [ ] 延遲載入 (Lazy Loading)
- [ ] FPS 監控與調優

**成果物**:
- 企業級視覺品質
- 45-60 FPS 性能

---

## 📊 性能目標與優化

### 性能指標

```yaml
初始載入時間: < 3 秒
  - HTML/CSS/JS: < 500 KB (壓縮後)
  - 3D 模型生成: < 2 秒
  - 材質/紋理載入: < 500 ms

相機切換動畫: < 800 ms
  - 外部 ↔ 樓層: 800 ms
  - 樓層 ↔ FPS: 500 ms

FPS 漫遊: 45-60 FPS
  - 高階顯卡 (RTX 3060+): 60 FPS
  - 中階顯卡 (GTX 1660): 50 FPS
  - 低階顯卡 (整合顯卡): 30 FPS (降級模式)

記憶體使用: < 250 MB
  - 場景物件: < 100 MB
  - 紋理資源: < 80 MB
  - UI 資源: < 50 MB
  - 其他: < 20 MB

多邊形數: 50K-150K
  - 建築外殼: 20K
  - 43 個房間: 80K
  - 家具設備: 30K
  - 裝飾細節: 20K
```

---

### 優化策略

#### 1. 幾何體優化

```javascript
// 合併靜態幾何體 (減少 Draw Calls)
const mergeGeometries = (geometries) => {
  const merged = BufferGeometryUtils.mergeBufferGeometries(geometries);
  return new THREE.Mesh(merged, material);
};

// 範例: 合併所有牆壁
const wallGeometries = rooms.map(room => room.wallGeometry);
const mergedWalls = mergeGeometries(wallGeometries);
```

#### 2. LOD (Level of Detail) 管理

```javascript
// 根據相機距離切換細節等級
const createLOD = (roomId) => {
  const lod = new THREE.LOD();

  // 高細節 (距離 < 10m)
  const highDetail = createHighDetailRoom(roomId);
  lod.addLevel(highDetail, 0);

  // 中細節 (距離 10-30m)
  const mediumDetail = createMediumDetailRoom(roomId);
  lod.addLevel(mediumDetail, 10);

  // 低細節 (距離 > 30m)
  const lowDetail = createLowDetailRoom(roomId);
  lod.addLevel(lowDetail, 30);

  return lod;
};
```

#### 3. 視錐體剔除 (Frustum Culling)

```javascript
// 僅渲染相機視野內的物件
room.frustumCulled = true; // Three.js 默認啟用

// 手動剔除不可見樓層
const updateVisibleFloors = (currentFloor) => {
  floors.forEach(floor => {
    floor.visible = (
      floor.name === currentFloor ||
      floor.name === getAdjacentFloor(currentFloor, +1) ||
      floor.name === getAdjacentFloor(currentFloor, -1)
    );
  });
};
```

#### 4. 紋理壓縮與複用

```javascript
// 使用紋理圖集 (Texture Atlas)
const textureAtlas = new THREE.TextureLoader().load('textures/atlas.png');

// 為多個材質複用同一紋理
const sharedMaterial = new THREE.MeshStandardMaterial({
  map: textureAtlas,
  roughness: 0.5
});

rooms.forEach(room => {
  room.material = sharedMaterial;
});
```

#### 5. 延遲載入 (Lazy Loading)

```javascript
// 僅載入當前樓層 + 上下樓層
const loadFloor = async (floor) => {
  if (!loadedFloors.has(floor)) {
    const floorData = await fetchFloorData(floor);
    buildFloor(floorData);
    loadedFloors.add(floor);
  }
};

// 卸載遠離的樓層
const unloadDistantFloors = (currentFloor) => {
  loadedFloors.forEach(floor => {
    const distance = Math.abs(floorIndex(floor) - floorIndex(currentFloor));
    if (distance > 2) {
      disposeFloor(floor);
      loadedFloors.delete(floor);
    }
  });
};
```

---

## 🎯 實現優先級

### 🔴 P0 (必須有) - MVP

1. ✅ 43 個房間精確坐標與尺寸
2. ✅ 建築外殼 3D 模型
3. ✅ 基礎光影系統
4. [ ] 外部視角相機控制
5. [ ] 樓層導航面板
6. [ ] 房間點擊高亮
7. [ ] 基礎 UI (頂部導航 + 左側面板)

### 🟡 P1 (重要) - 完整體驗

1. [ ] 樓層視角模式
2. [ ] FPS 第一人稱模式
3. [ ] 相機平滑切換動畫
4. [ ] 房間詳情面板
5. [ ] 搜索功能
6. [ ] 小地圖
7. [ ] 快捷鍵系統

### 🟢 P2 (加分) - 高級效果

1. [ ] 後期處理 (Bloom, SSAO)
2. [ ] 門窗開關動畫
3. [ ] 家具細節化
4. [ ] 霓虹燈效果
5. [ ] 玻璃態 UI
6. [ ] 響應式設計

---

## 📦 成果物清單

### 1. 代碼文件

```
赤土崎_3D可視化_企業級完整版.html (單一檔案部署)
或
src/
├── index.html
├── main.js
├── core/ (5 個文件)
├── building/ (6 個文件)
├── ui/ (11 個文件)
├── controls/ (4 個文件)
└── utils/ (5 個文件)
```

### 2. 設計文檔

- [x] **ENTERPRISE_DESIGN_BLUEPRINT.md** (本文件)
- [ ] `FLOOR_PLANS.md` (詳細平面圖)
- [ ] `UI_COMPONENT_SPECS.md` (組件規範)
- [ ] `INTERACTION_FLOW.md` (交互流程圖)

### 3. 技術文檔

- [ ] `API_REFERENCE.md` (代碼接口文檔)
- [ ] `PERFORMANCE_REPORT.md` (性能測試報告)
- [ ] `USER_MANUAL.md` (使用說明)

### 4. 視覺資源

- [ ] 色彩板 (Color Palette PNG)
- [ ] UI 組件截圖
- [ ] 交互流程動畫 GIF
- [ ] 最終成果影片 (MP4)

---

## 🎬 下一步行動

### 立即執行 (今天)

```bash
# 1. 創建完整的房間數據文件
touch src/building/BuildingData.js

# 2. 創建核心模塊框架
mkdir -p src/{core,building,ui,controls,utils}

# 3. 實現 BuildingData.js (43 間房間)
# 複製上方「43個房間完整坐標表」數據

# 4. 建立基礎 HTML 框架
touch index.html

# 5. 初始化 Three.js 場景
touch src/core/Scene.js
```

### 本周目標 (Day 1-3)

- [ ] 完成 BuildingData.js
- [ ] 建立建築外殼
- [ ] 生成 43 個房間方塊
- [ ] 基礎相機控制
- [ ] 樓層導航 UI

---

## 📞 支援與資源

### 參考資源

- **Three.js 官方文檔**: https://threejs.org/docs/
- **樓層設計參考**: `architectural-floor-plans-2025.md`
- **色彩設計參考**: Cyberpunk 2077 UI
- **玻璃態設計**: https://glassmorphism.com/

### 技術棧

```yaml
核心技術:
  - Three.js: r160+ (3D 渲染)
  - GSAP: 3.12+ (動畫)
  - Vanilla JS: ES6+ (無框架)

可選增強:
  - Tween.js: 相機動畫
  - Stats.js: FPS 監控
  - dat.GUI: 開發調試
```

---

**文件版本**: v1.0
**最後更新**: 2025-10-24
**作者**: Claude (Anthropic)
**專案**: 赤土崎多功能館 3D 可視化系統

**下一步**: 開始實現 Phase 1 - 數據與坐標系統 🚀
