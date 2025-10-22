# 📂 專案檔案重組計畫

**規劃時間**: 2025-10-23
**目標**: 清理根目錄混亂，建立清晰的專案結構

---

## 🎯 現況問題

1. **根目錄檔案過多** (60+ 檔案)
2. **檔案分類不清**  (研究報告、腳本、資料混雜)
3. **重複檔案** (v2 版本、.docx/.md 重複)
4. **過時檔案** (臨時輸出、測試檔案)

---

## 📁 新目錄結構設計

```
easterlin-hsinchu/
│
├── 📄 README.md                    # 專案總覽（更新版，含超連結索引）
├── 📄 CLAUDE.md                    # 黑客松完整指南
├── 📄 PROJECT_COMPLETION_SUMMARY.md # 專案完成總結
├── 📄 .gitignore
├── 📄 requirements.txt
│
├── 📂 docs/                        # 📚 研究報告與分析文件
│   ├── 📂 research/                # 調研報告
│   │   ├── critical-update-2025-10-22.md
│   │   ├── research-report-2025-10-22.md
│   │   ├── qualitative-research.md
│   │   └── data-cleaning-and-enhancement.md
│   │
│   ├── 📂 policy-analysis/         # 政策分析
│   │   ├── tender-tracking-report-2025-10-22.md
│   │   ├── Xin-Zhu-Shi-Zheng-Fu-Biao-An-Fen-Xi.md
│   │   ├── long-term-care-2-0-policy-analysis-2025.md
│   │   └── policy-docking-and-financial-model.md
│   │
│   ├── 📂 service-analysis/        # 服務分析
│   │   ├── childcare-resource-analysis-2025.md
│   │   ├── day-care-center-analysis-2025.md
│   │   ├── service-gap-report-2025.md
│   │   └── pain-point-quantification-analysis-2025.md
│   │
│   ├── 📂 design/                  # 設計方案
│   │   ├── architectural-floor-plans-2025.md
│   │   ├── cross-age-integration-design-2025.md
│   │   ├── Identification-of-cross-age-care-needs-patterns.md
│   │   └── space-planning-service-process-design.md
│   │
│   └── 📂 business/                # 商業模式
│       ├── SROI-Calculation-Report-2025.md
│       ├── Corporate-Partnership-Proposal-TSMC-2025.md
│       └── 10-page-hackathon-presentation-outline.md
│
├── 📂 data/                        # 🗄️ 資料檔案
│   ├── 📂 raw/                     # 原始資料
│   │   └── structured_data.json
│   │
│   ├── 📂 processed/               # 處理後資料
│   │   ├── cleaned_data_enhanced.json
│   │   ├── key_quotes_collection.json
│   │   └── hsinchu_income_map_2022.json
│   │
│   └── 📂 analysis/                # 分析產出
│       ├── emotion_analysis_enhanced.csv
│       ├── entity_extraction_enhanced.csv
│       ├── pain_point_matrix.csv
│       ├── policy_mapping_report.csv
│       ├── topic_distribution.csv
│       └── timeline.csv
│
├── 📂 scripts/                     # 🔧 Python 腳本
│   ├── 📂 data-processing/         # 資料處理
│   │   ├── process_articles.py
│   │   ├── data_assessment.py
│   │   └── data_enhancement.py
│   │
│   └── 📂 presentation-generation/ # 簡報生成
│       ├── generate_financial_excel.py
│       ├── generate_tsmc_presentation_v2.py
│       └── generate_mediatek_presentation_v2.py
│
├── 📂 outputs/                     # 📊 產出檔案
│   ├── 📂 presentations/           # 簡報檔案
│   │   ├── 台積電ESG合作提案_V2_16x9_2025.pptx
│   │   ├── 聯發科ESG合作提案_V2_16x9_2025.pptx
│   │   └── 赤土崎全齡社福樞紐_財務試算表_2025.xlsx
│   │
│   ├── 📂 reports/                 # 文字報告
│   │   ├── hackathon_data_summary.md
│   │   ├── DATA_PROCESSING_COMPLETE.md
│   │   └── PRESENTATION_CRITIQUE_AND_REDESIGN.md
│   │
│   └── 📂 dashboards/              # 儀表板
│       └── interactive-dashboard.html
│
├── 📂 visualization/               # 🎨 視覺化組件（維持不變）
│   └── (React components...)
│
├── 📂 presentation/                # 🎬 簡報生成工具（維持不變）
│   └── (HTML slides + generators...)
│
├── 📂 article/                     # 📰 原始文章（維持不變）
│   └── (HTML articles...)
│
└── 📂 references/                  # 📚 參考文件
    └── 臺灣長期照顧實作指引/
