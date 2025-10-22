# 竹科家庭痛點分析 - React 視覺化組件套件

**專案目標**: 114年新竹政策黑客松 - 赤土崎全齡社福樞紐提案
**更新日期**: 2025-10-22
**技術棧**: React 18 + Recharts 2.10 + Vite 5

---

## 📋 組件總覽

本套件提供 **7個專業級視覺化組件**，基於真實數據分析（11篇高品質文章，5年時間跨度）：

### 1. 完整儀表板 (`CompleteDashboard`)
整合所有圖表的綜合視圖，包含：
- 4個關鍵指標卡片
- 6大互動式圖表
- 完整的洞察說明

**使用場景**: 黑客松簡報結尾總覽、網站首頁展示

### 2. 痛點優先級矩陣 (`PainPointPriorityMatrix`)
散點圖展示6大痛點類別的優先順序
- X軸：影響廣度（受影響家庭比例%）
- Y軸：痛點深度（平均強度1-3分）
- 泡泡大小：優先級分數
- 顏色區分：高中低優先級

**核心發現**: 時間類痛點位於右上角（54.5%影響廣度 × 3.0深度 = 4.91分）

### 3. 痛點類別分布 (`PainPointDistribution`)
橫條圖顯示6大痛點類別出現頻率
- 時間類：54.5% ⭐
- 關係類：36.4%
- 健康類：9.1%
- 資源類：9.1%
- 心理類：0%
- 金錢類：0%

**核心洞察**: 金錢類痛點0%，推翻「年薪300萬貧戶」標題，真正問題是時間貧窮

### 4. 服務缺口對比 (`ServiceGapComparison`)
堆疊條形圖對比現有供給與需求缺口
- C級長照站：91%缺口
- 日照中心：81.5%缺口
- 公共托嬰：100%缺口
- 青少年中心：100%缺口

**核心論點**: 整合赤土崎館可優先填補公托+日照兩大缺口

### 5. 主題覆蓋率雷達圖 (`TopicCoverageRadar`)
雷達圖展示6大主題在資料中的覆蓋率
- 工作-家庭平衡：100%
- 托育/教育壓力：54.5%
- 社群焦慮/教養競爭：36.4%
- 心理健康：27.3%
- 時間貧窮：18.2%
- 長照/失智照護：9.1%

### 6. 情緒分數分布 (`EmotionDistributionPie`)
圓餅圖顯示文章情緒傾向分布
- 中性（0.0）：72.7%
- 負面（-0.1~-0.3）：18.2%
- 正面（+0.5）：9.1%

**數據可信度**: 大部分文章保持中立報導，增加分析客觀性

### 7. 議題熱度時間軸 (`TimelineChart`)
折線圖追蹤2021-2025年議題熱度變化
- 2021年：1篇（竹科媽媽群組爭議）
- 2022年：2篇（新竹5缺點討論）
- 2023-2024年：0篇
- 2025年：8篇（年薪300萬貧戶熱議）

**策略意義**: 議題持續發酵5年未解決，顯示政策介入的迫切性

---

## 🚀 快速開始

### 安裝依賴
```bash
cd visualization
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```
瀏覽器會自動開啟 `http://localhost:3000`

### 建置生產版本
```bash
npm run build
```
輸出至 `dist/` 目錄

---

## 📊 使用範例

### 範例 1：單獨使用優先級矩陣
```jsx
import { PainPointPriorityMatrix } from './PainPointDashboard';

function MyPresentation() {
  return (
    <div>
      <h1>痛點分析</h1>
      <PainPointPriorityMatrix width={800} height={600} />
    </div>
  );
}
```

### 範例 2：使用完整儀表板
```jsx
import { CompleteDashboard } from './PainPointDashboard';

function App() {
  return <CompleteDashboard />;
}
```

### 範例 3：自訂樣式
```jsx
import { PainPointDistribution } from './PainPointDashboard';

function CustomView() {
  return (
    <div style={{ background: '#f5f5f5', padding: '40px' }}>
      <PainPointDistribution width={700} height={450} />
    </div>
  );
}
```

---

## 🎯 黑客松簡報使用指南

### 簡報流程建議（5-8分鐘）

**1. 開場（30秒）**
- 展示：`TimelineChart`
- 論點：「議題持續發酵5年，2025年討論激增至8篇文章」
- 金句：「這不是新問題，是長期未解決的問題」

**2. 痛點分析（2分鐘）**
- 展示：`PainPointPriorityMatrix` + `PainPointDistribution`
- 論點：「54.5%痛點來自時間貧窮，而非金錢（0%）」
- 金句：「竹科家庭的痛點不是『缺服務』，而是『服務分散』」

**3. 服務缺口（1.5分鐘）**
- 展示：`ServiceGapComparison`
- 論點：「公托100%缺口、日照81.5%缺口」
- 金句：「赤土崎整合方案可同時填補兩大缺口」

**4. 主題深度（1分鐘）**
- 展示：`TopicCoverageRadar` + `EmotionDistributionPie`
- 論點：「100%涉及工作-家庭平衡，18.2%負面情緒」
- 金句：「這是真實的痛苦，不是數據遊戲」

**5. 結尾總覽（30秒）**
- 展示：`CompleteDashboard`（關鍵指標卡片）
- 論點：「標案10/30開標，設計階段11-12月是最後窗口」
- 金句：「不要再讓竹科家庭的時間，浪費在接送的路上」

---

## 📸 截圖與匯出建議

### 方法 1：瀏覽器截圖（推薦）
1. 開啟開發者工具（F12）
2. 切換至「裝置工具列」（Ctrl+Shift+M）
3. 設定螢幕解析度（1920x1080 或更高）
4. 右鍵 → 「擷取螢幕截圖」

### 方法 2：使用截圖工具
- Windows：Snipping Tool（Win+Shift+S）
- Mac：Screenshot（Cmd+Shift+4）
- 第三方：Lightshot、Snagit

### 方法 3：程式化匯出
```jsx
import html2canvas from 'html2canvas';

const exportChart = async (elementId) => {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element, { scale: 2 });
  const link = document.createElement('a');
  link.download = `${elementId}.png`;
  link.href = canvas.toDataURL();
  link.click();
};
```

---

## 🎨 自訂數據

如需更新數據，請修改 `PainPointDashboard.jsx` 中的數據配置：

```jsx
// 痛點優先級矩陣數據
const priorityMatrixData = [
  {
    name: '時間類',
    impact: 54.5,    // 修改此處
    intensity: 3.0,  // 修改此處
    priority: 4.91,
    color: '#ff6384',
    size: 800
  },
  // ... 更多數據
];
```

所有數據來源於：
- `cleaned_data_enhanced.json`（原始資料）
- `pain_point_matrix.csv`（痛點矩陣）
- `emotion_analysis_enhanced.csv`（情緒分析）
- 5份政策研究報告（交叉驗證）

---

## 🛠️ 技術細節

### 依賴項
- **React 18**: UI框架
- **Recharts 2.10**: 圖表庫（基於D3.js）
- **Vite 5**: 開發工具（快速HMR）

### 瀏覽器支援
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### 效能優化
- 使用 `ResponsiveContainer` 自適應螢幕
- 圖表懶加載（可選）
- 數據快取避免重複計算

---

## ❓ 常見問題

**Q: 圖表顯示不出來？**
A: 確認已安裝 `recharts`：`npm install recharts`

**Q: 如何修改顏色？**
A: 修改數據配置中的 `color` 屬性

**Q: 可以匯出為SVG嗎？**
A: Recharts支援SVG，可使用瀏覽器「檢查元素」複製SVG代碼

**Q: 可以在PowerPoint中使用嗎？**
A: 建議截圖後插入，或使用Web版PowerPoint嵌入

**Q: 數據更新頻率？**
A: 本版本為靜態數據（2025-10-22），如需即時更新請接API

---

## 📁 檔案結構

```
visualization/
├── PainPointDashboard.jsx  # 主要組件（7個圖表）
├── App.jsx                 # 範例應用程式
├── main.jsx                # 入口點
├── index.html              # HTML模板
├── package.json            # 依賴項配置
├── vite.config.js          # Vite配置
└── README.md               # 本文件
```

---

## 🏆 黑客松致勝建議

### 視覺化策略
1. **開場衝擊**：用時間軸圖建立問題的歷史脈絡
2. **數據說服**：優先級矩陣展示量化分析的專業性
3. **缺口凸顯**：服務缺口圖製造「100%缺口」的視覺衝擊
4. **情感共鳴**：情緒分布圖證明「這是真實的痛苦」
5. **整合收尾**：完整儀表板展現「全面的數據驅動分析」

### 簡報技巧
- **指著圖表說話**：「看這個右上角的紅點，代表...」
- **數據對比**：「100%缺口 vs 9%供給，這是什麼概念？」
- **時間緊迫性**：「10/30開標，過了這村沒這店」
- **成本量化**：「整合方案節省NT$220-370M」

### Q&A預案
- **Q: 樣本數只有11篇？**
  → 指著雷達圖說：「但覆蓋6大主題，交叉驗證5份政策報告」

- **Q: 為何整合比分散好？**
  → 指著優先級矩陣說：「54.5%痛點來自時間貧窮，整合減少接送時間」

---

## 📞 聯絡與支援

**專案負責人**: Easterlin Hsinchu Team
**更新日期**: 2025-10-22
**目標**: 114年新竹政策黑客松冠軍 🏆

---

**準備完畢，全力衝刺黑客松！** 🚀

使用本視覺化套件，結合：
- 質性研究分析報告
- 政策對接論述
- 標案時機窗口
- 成本效益量化

您已具備完整的數據驅動提案能力！

**下一步**: 開啟 `npm run dev`，檢視所有圖表，選擇適合簡報的視覺化組件。
