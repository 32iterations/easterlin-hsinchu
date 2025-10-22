# 🏆 赤土崎全齡社福樞紐 - 114年新竹政策黑客松

**專案代號**: 竹科家庭全齡支持中心
**目標**: 新竹政策黑客松冠軍提案
**最後更新**: 2025-10-23
**狀態**: ✅ 完整開發完成

---

## 📋 專案總覽

### 核心提案
**「赤土崎多功能館 - 竹科家庭全齡支持中心」**

將新竹市府積極推進的**赤土崎多功能館**（規劃設計預算 2,287 萬，標案 114A109，10/30 開標），打造為整合「**長照日照中心 + 公共托嬰中心 + 青少年活動中心**」三大功能的旗艦示範中心。

### 致勝公式
```
高門檻 + 政策對接 + 普世共鳴 + 可落地性 = 奪冠
```

---

## 🗂️ 專案結構

```
easterlin-hsinchu/
│
├── 📄 README.md                           # 本檔案（專案總覽）
├── 📄 CLAUDE.md                           # 黑客松完整指南
├── 📄 PROJECT_COMPLETION_SUMMARY.md       # 專案完成總結
├── 📄 requirements.txt                    # Python 依賴
│
├── 📂 docs/                               # 📚 研究報告與分析文件
│   ├── 📂 research/                       # 調研報告（4個）
│   ├── 📂 policy-analysis/                # 政策分析（4個）
│   ├── 📂 service-analysis/               # 服務分析（4個）
│   ├── 📂 design/                         # 設計方案（4個）
│   └── 📂 business/                       # 商業模式（3個）
│
├── 📂 data/                               # 🗄️ 資料檔案
│   ├── 📂 raw/                            # 原始資料（1個）
│   ├── 📂 processed/                      # 處理後資料（3個）
│   └── 📂 analysis/                       # 分析產出（6個 CSV）
│
├── 📂 scripts/                            # 🔧 Python 腳本
│   ├── 📂 data-processing/                # 資料處理（3個）
│   └── 📂 presentation-generation/        # 簡報生成（4個）
│
├── 📂 outputs/                            # 📊 產出檔案
│   ├── 📂 presentations/                  # 簡報檔案（5個）
│   ├── 📂 reports/                        # 文字報告（4個）
│   └── 📂 dashboards/                     # 儀表板（1個）
│
├── 📂 visualization/                      # 🎨 React 視覺化組件
├── 📂 presentation/                       # 🎬 HTML 簡報生成工具
├── 📂 article/                            # 📰 原始文章（19篇）
└── 📂 references/                         # 📚 參考文件
```

---

## 📚 核心文檔導覽（含超連結）

### 🎯 必讀文件

| 文件 | 說明 | 路徑 |
|------|------|------|
| **黑客松完整指南** | 策略、標案、痛點、解決方案 | [CLAUDE.md](./CLAUDE.md) |
| **專案完成總結** | 7大任務、快速啟動、致勝關鍵 | [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md) |
| **重組計畫** | 目錄結構設計說明 | [REORGANIZATION_PLAN.md](./REORGANIZATION_PLAN.md) |

---

### 📊 研究報告（docs/research/）

| 文件 | 說明 | 路徑 |
|------|------|------|
| **關鍵更新報告** | 2025-10-22 重大發現 | [critical-update-2025-10-22.md](./docs/research/critical-update-2025-10-22.md) |
| **研究總報告** | 完整調研分析 | [research-report-2025-10-22.md](./docs/research/research-report-2025-10-22.md) |
| **質性研究** | 紮根理論三層編碼 | [qualitative-research.md](./docs/research/qualitative-research.md) |
| **資料清理方法** | 6階段處理流程 | [data-cleaning-and-enhancement.md](./docs/research/data-cleaning-and-enhancement.md) |

---

### 🏛️ 政策分析（docs/policy-analysis/）

| 文件 | 說明 | 路徑 |
|------|------|------|
| **標案追蹤報告** | 114A109 標案詳細分析 | [tender-tracking-report-2025-10-22.md](./docs/policy-analysis/tender-tracking-report-2025-10-22.md) |
| **新竹市政府標案分析** | 三館進度對比 | [Xin-Zhu-Shi-Zheng-Fu-Biao-An-Fen-Xi.md](./docs/policy-analysis/Xin-Zhu-Shi-Zheng-Fu-Biao-An-Fen-Xi.md) |
| **長照2.0政策分析** | 長照體系深度解析 | [long-term-care-2-0-policy-analysis-2025.md](./docs/policy-analysis/long-term-care-2-0-policy-analysis-2025.md) |
| **政策對接與財務模型** | 財劃法+214億機會 | [policy-docking-and-financial-model.md](./docs/policy-analysis/policy-docking-and-financial-model.md) |

---

### 🔍 服務分析（docs/service-analysis/）

| 文件 | 說明 | 路徑 |
|------|------|------|
| **托育資源分析** | 新竹市托育現況 | [childcare-resource-analysis-2025.md](./docs/service-analysis/childcare-resource-analysis-2025.md) |
| **日照中心分析** | 長照服務缺口 | [day-care-center-analysis-2025.md](./docs/service-analysis/day-care-center-analysis-2025.md) |
| **服務缺口報告** | 供需對比分析 | [service-gap-report-2025.md](./docs/service-analysis/service-gap-report-2025.md) |
| **痛點量化分析** | 5大痛點數據化 | [pain-point-quantification-analysis-2025.md](./docs/service-analysis/pain-point-quantification-analysis-2025.md) |

---

### 🏗️ 設計方案（docs/design/）

| 文件 | 說明 | 路徑 |
|------|------|------|
| **建築樓層配置圖** | B1+4F 詳細平面圖（1,600行） | [architectural-floor-plans-2025.md](./docs/design/architectural-floor-plans-2025.md) |
| **跨齡整合設計** | 分時共享、跨齡互助 | [cross-age-integration-design-2025.md](./docs/design/cross-age-integration-design-2025.md) |
| **跨齡照護需求模式** | 使用者旅程地圖 | [Identification-of-cross-age-care-needs-patterns.md](./docs/design/Identification-of-cross-age-care-needs-patterns.md) |
| **空間規劃與服務流程** | 動線設計 | [space-planning-service-process-design.md](./docs/design/space-planning-service-process-design.md) |

---

### 💼 商業模式（docs/business/）

| 文件 | 說明 | 路徑 |
|------|------|------|
| **SROI 計算報告** | 社會投資報酬率 | [SROI-Calculation-Report-2025.md](./docs/business/SROI-Calculation-Report-2025.md) |
| **台積電 ESG 合作提案** | 企業夥伴方案 | [Corporate-Partnership-Proposal-TSMC-2025.md](./docs/business/Corporate-Partnership-Proposal-TSMC-2025.md) |
| **10頁黑客松簡報大綱** | 簡報結構設計 | [10-page-hackathon-presentation-outline.md](./docs/business/10-page-hackathon-presentation-outline.md) |

---

## 🚀 快速啟動

### 1. 視覺化組件（React）

```bash
# 進入 visualization 目錄
cd visualization

# 安裝依賴（首次執行）
npm install

# 啟動開發伺服器
npm run dev

# 瀏覽器會自動開啟 http://localhost:3000
```

**13個互動式視圖**：
- 24小時服務時間軸
- 用戶旅程地圖（3種 Persona）
- 6個月實施時程甘特圖
- 人力配置與預算試算
- 互動式空間導覽
- 感染監測儀表板
- 完整痛點分析儀表板（6個圖表）

詳細說明：[visualization/README.md](./visualization/README.md)

---

### 2. HTML 簡報生成

```bash
# 進入 presentation 目錄
cd presentation

# 安裝依賴
npm install

# 生成 PPTX（需要 Node.js）
node generate-pptx-final.js

# 或直接開啟 HTML 投影片
# 在瀏覽器中打開 slide-*.html
```

**10張投影片**：完整黑客松簡報
詳細說明：[presentation/README.md](./presentation/README.md)

---

### 3. 資料處理腳本

```bash
# 安裝 Python 依賴
pip install -r requirements.txt

# 執行文章處理
python scripts/data-processing/process_articles.py

# 執行資料評估
python scripts/data-processing/data_assessment.py

# 執行資料增強（6階段）
python scripts/data-processing/data_enhancement.py
```

---

## 📊 關鍵數據總覽

### 建築規模
- **總樓地板面積**: 3,100 m² (850-970坪)
- **樓層**: B1 + 4F（5層）
- **服務人數**: 140-180人/日
- **車位**: 30個（含親子5格、無障礙5格）

### 人力配置
- **總人數**: 29名（含兼職）
- **1F長照**: 8名（照服員6 + 護理師1 + 社工1）
- **2F托育**: 7名（教保員6 + 護理師1）
- **3F家庭**: 7名（心理師2 + 社工1 + 廚師2 + 助手2）
- **4F青少年**: 5名（輔導員3 + 講師2）
- **行政支援**: 5名（館長1 + 行政2 + 警衛2）

### 財務試算
- **月營運成本**: 194萬元
- **月總收入**: 195萬元
- **月淨收入**: +1萬元（收支平衡）
- **年營運成本**: 1,940萬元（含年終、勞健保）

### 實施時程
- **標案決標**: 2025/10/30（已公告）
- **設計階段**: 2025/11-2026/02（107天）
- **法規申請**: 2026/02-2026/03（28天）
- **工程發包**: 2026/03-2026/04（35天）
- **試營運**: 2026/04/30

---

## 🎯 竹科家庭五大痛點

根據 19 篇文章分析（2021-2025）：

1. **工作-家庭平衡** (89.5%, 17篇)
   - 長工時、加班文化
   - 輪班制度影響家庭作息
   - 無法陪伴孩子與家人

2. **財務壓力** (78.9%, 15篇)
   - 高房價與生活成本
   - 年收300萬仍感貧窮
   - 消費水平高

3. **生活品質** (68.4%, 13篇)
   - 生活機能不足
   - 娛樂選擇少
   - 交通壅塞

4. **跨縣市通勤** (57.9%, 11篇)
   - 與台北的往返困難
   - 大眾運輸不便
   - 需要家庭雙車

5. **托育/教育壓力** (42.1%, 8篇)
   - 托育機構時間限制
   - 教育資源競爭
   - 才藝學習壓力

詳細分析：[docs/service-analysis/pain-point-quantification-analysis-2025.md](./docs/service-analysis/pain-point-quantification-analysis-2025.md)

---

## 🔥 致勝關鍵

### 1. 政策對接精準
- ✅ **標案已驗證**：114A109（10/30開標，2,287萬元）
- ✅ **時機敏感**：設計階段11/8-11/28是最後窗口
- ✅ **預算充足**：財劃法修正，新竹市+210億（253%增幅）

### 2. 技術門檻高
- ✅ **建築設計**：STC 65隔音、IIC 70地板、垂直分層
- ✅ **CDC 2025標準**：HEPA H13、6-8 ACH、即時監測
- ✅ **國際實證**：日本、荷蘭、台灣案例交叉驗證

### 3. 數據驅動完整
- ✅ **質性研究**：11篇文章、5年時間跨度、紮根理論三層編碼
- ✅ **量化分析**：54.5%時間貧窮、81.5%日照缺口、100%公托缺口
- ✅ **財務可行**：收支平衡、29名員工、194萬月成本

### 4. 視覺化專業
- ✅ **13個互動式組件**：React + Recharts，可即時展示
- ✅ **Mermaid圖表**：流程圖、甘特圖、旅程圖，易於嵌入簡報
- ✅ **3D空間導覽**：點擊式探索，直覺理解設計

### 5. 普世共鳴強
- ✅ **竹科家庭痛點**：年薪300萬仍是「時間貧戶」
- ✅ **跨齡互助**：長者MMSE +2.8分、幼兒語言+15%
- ✅ **社會價值**：弱勢家庭支持、單親免費服務

---

## 📈 產出檔案清單

### 簡報檔案（outputs/presentations/）
- `台積電ESG合作提案_赤土崎全齡社福樞紐_2025.pptx`
- `台積電ESG合作提案_V2_16x9_2025.pptx`
- `聯發科技ESG合作提案_赤土崎全齡社福樞紐_2025.pptx`
- `聯發科ESG合作提案_V2_16x9_2025.pptx`
- `赤土崎全齡社福樞紐_財務試算表_2025.xlsx`

### 報告檔案（outputs/reports/）
- `hackathon_data_summary.md` - 資料總結
- `DATA_PROCESSING_COMPLETE.md` - 6階段處理完成報告
- `PRESENTATION_CRITIQUE_AND_REDESIGN.md` - 簡報設計評論
- `VISUALIZATION_QUICKSTART.md` - 視覺化快速啟動

### 儀表板（outputs/dashboards/）
- `interactive-dashboard.html` - 互動式痛點分析儀表板

---

## 🛠️ 技術棧

### 前端開發
- **React 18**: 組件化UI開發
- **Recharts 2.10**: 資料視覺化圖表庫（基於D3.js）
- **Vite 5**: 快速開發工具（HMR熱更新）

### 資料處理
- **Python 3.13**
- **BeautifulSoup4**: HTML 解析
- **jieba**: 中文分詞與關鍵詞提取
- **pandas**: 資料分析
- **numpy**: 數值計算

### 設計工具
- **Mermaid**: 流程圖、甘特圖、旅程圖語法
- **Markdown**: 文檔撰寫（GitHub Flavored）

### 簡報生成
- **PptxGenJS**: PPTX 生成庫（Node.js）
- **HTML/CSS**: 投影片設計

---

## 📞 專案資訊

**專案團隊**: Easterlin Hsinchu Team
**開發時間**: 2025-10-19 至 2025-10-23
**最後更新**: 2025-10-23
**版本**: v1.0 - 完整版

---

## 🎉 結語

**所有7項任務已全部完成！**

本專案提供完整的：
- ✅ **建築設計方案**（1,600行詳細文檔）
- ✅ **視覺化組件**（13個互動式React組件）
- ✅ **財務可行性分析**（收支平衡、人力配置）
- ✅ **實施時程規劃**（6個月甘特圖）
- ✅ **用戶體驗設計**（3種Persona旅程）
- ✅ **技術創新展示**（CDC標準、智慧監控）

**祝黑客松提案成功！🏆**

---

**處理日期**：2025-10-22
**資料筆數**：19 篇文章
**分析工具**：Python + BeautifulSoup + jieba + React + Recharts
