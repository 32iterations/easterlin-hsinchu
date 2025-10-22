/**
 * 赤土崎全齡社福樞紐 - PowerPoint 最終優化版
 * 報告人：蔡秀吉
 * 114年新竹政策黑客松
 *
 * 整合所有批判性分析改進建議
 */

const PptxGenJS = require("pptxgenjs");

console.log("📊 開始生成 PowerPoint 簡報（最終優化版）...\n");

// 創建簡報對象
let pres = new PptxGenJS();

// 設置簡報屬性
pres.layout = "LAYOUT_16x9";
pres.author = "蔡秀吉";
pres.title = "赤土崎全齡社福樞紐 - 114年新竹政策黑客松";
pres.subject = "解決竹科家庭時間貧窮的整合方案";
pres.company = "赤土崎全齡社福樞紐專案團隊";

// 定義顏色方案
const COLORS = {
    primary: "0066CC",
    secondary: "00A651",
    accent: "FF6600",
    warning: "DC143C",
    purple: "9C27B0",
    lightBlue: "1976D2",
    white: "FFFFFF",
    black: "333333",
    gray: "666666",
    lightGray: "F5F5F5",
    gold: "FFD700"
};

// ==================== 第1頁：開場金句（改進：添加視覺提示） ====================
console.log("✓ 創建第1頁：開場金句");
let slide1 = pres.addSlide();
slide1.background = { color: COLORS.primary };

// 圖片佔位符提示
slide1.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 0.3, w: 9.4, h: 0.5,
    fill: { color: COLORS.black, transparency: 30 },
    line: { type: "none" }
});
slide1.addText("💡 建議添加：竹科晚上8:30停車場燈火通明的照片（Unsplash: 'taiwan science park night'）", {
    x: 0.4, y: 0.35, w: 9.2, h: 0.4,
    fontSize: 10, color: COLORS.gold, italic: true,
    align: "center", fontFace: "Arial"
});

// 主標題
slide1.addText("「為什麼媽媽你今天", {
    x: 0.5, y: 1.2, w: 9.0, h: 0.7,
    fontSize: 44, bold: true, color: COLORS.gold,
    align: "center", fontFace: "Arial"
});
slide1.addText("不用在公司？」", {
    x: 0.5, y: 1.9, w: 9.0, h: 0.7,
    fontSize: 44, bold: true, color: COLORS.gold,
    align: "center", fontFace: "Arial"
});

// 副標題
slide1.addText("竹科孩子在晚上8:30看到媽媽提早回家時，脫口而出的疑問", {
    x: 1.0, y: 2.75, w: 8.0, h: 0.4,
    fontSize: 16, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 數據卡片
const dataCards = [
    { text: "100%", desc: "工作-家庭\n失衡困境", x: 1.5 },
    { text: "54.5%", desc: "時間貧窮\n痛點", x: 4.0 },
    { text: "36.4%", desc: "家庭關係\n危機", x: 6.5 }
];

dataCards.forEach(card => {
    slide1.addShape(pres.ShapeType.rect, {
        x: card.x, y: 3.3, w: 2.0, h: 1.2,
        fill: { color: COLORS.white, transparency: 5 },
        line: { type: "none" }
    });
    slide1.addText(card.text, {
        x: card.x, y: 3.4, w: 2.0, h: 0.5,
        fontSize: 36, bold: true, color: COLORS.accent,
        align: "center", fontFace: "Arial"
    });
    slide1.addText(card.desc, {
        x: card.x, y: 3.95, w: 2.0, h: 0.45,
        fontSize: 13, color: COLORS.black,
        align: "center", fontFace: "Arial"
    });
});

// 底部資訊
slide1.addText("赤土崎全齡社福樞紐 — 解決竹科家庭「時間貧窮」的整合方案", {
    x: 0.5, y: 4.75, w: 9.0, h: 0.3,
    fontSize: 14, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

slide1.addText("報告人：蔡秀吉 | 資料來源：11篇竹科家庭質性研究分析（2021-2025）", {
    x: 0.5, y: 5.08, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.white,
    fontFace: "Arial"
});

slide1.addText("1 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.white,
    align: "right", fontFace: "Arial"
});

// ==================== 第2頁：痛點量化 ====================
console.log("✓ 創建第2頁：痛點量化");
let slide2 = pres.addSlide();
slide2.background = { color: COLORS.white };

slide2.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { type: "solid", color: COLORS.primary }
});
slide2.addText("竹科家庭的痛點不是「缺服務」而是「服務分散」", {
    x: 0.5, y: 0.18, w: 9.0, h: 0.4,
    fontSize: 26, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 左側：金句框
slide2.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 4.5, h: 1.0,
    fill: { color: "FFF3E0" },
    line: { color: COLORS.accent, width: 3 }
});
slide2.addText("🐹 「如同被鐵網困住的倉鼠」", {
    x: 0.6, y: 1.1, w: 4.3, h: 0.3,
    fontSize: 15, bold: true, color: COLORS.black,
    fontFace: "Arial"
});
slide2.addText("— 鏡週刊深度報導，2025年6月", {
    x: 0.6, y: 1.45, w: 4.3, h: 0.3,
    fontSize: 11, color: COLORS.gray, italic: true,
    fontFace: "Arial"
});
slide2.addText("（每天在家、公司、托育所之間來回奔波）", {
    x: 0.6, y: 1.7, w: 4.3, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

// 痛點分類標題
slide2.addText("痛點分類矩陣（11篇文章分析）", {
    x: 0.5, y: 2.05, w: 4.5, h: 0.3,
    fontSize: 15, bold: true, color: COLORS.primary,
    fontFace: "Arial"
});

// 痛點分類數據
const painPoints = [
    { pct: "54.5%", text: "時間類：接送、通勤、等待", y: 2.45 },
    { pct: "36.4%", text: "關係類：夫妻衝突、親子疏離", y: 2.9 },
    { pct: "9.1%", text: "健康類：慢性病、心理健康", y: 3.35 },
    { pct: "9.1%", text: "資源類：服務分散、托育不足", y: 3.8 }
];

painPoints.forEach(point => {
    slide2.addShape(pres.ShapeType.rect, {
        x: 0.6, y: point.y, w: 0.8, h: 0.35,
        fill: { color: COLORS.accent }
    });
    slide2.addText(point.pct, {
        x: 0.6, y: point.y, w: 0.8, h: 0.35,
        fontSize: 14, bold: true, color: COLORS.white,
        align: "center", valign: "middle", fontFace: "Arial"
    });
    slide2.addText(point.text, {
        x: 1.5, y: point.y, w: 3.4, h: 0.35,
        fontSize: 12, color: COLORS.black,
        valign: "middle", fontFace: "Arial"
    });
});

// 右側：一天的動線地圖
slide2.addText("一天的動線地圖", {
    x: 5.5, y: 0.95, w: 4.0, h: 0.3,
    fontSize: 15, bold: true, color: COLORS.accent,
    fontFace: "Arial"
});

const journey = [
    { time: "07:00", loc: "東區", desc: "送長輩至日照中心（8公里）", y: 1.4 },
    { time: "07:30", loc: "北區", desc: "送幼兒至托育中心（6公里）", y: 2.0 },
    { time: "08:00", loc: "竹科", desc: "到公司上班（5公里）", y: 2.6 },
    { time: "17:00", loc: "北區", desc: "接小孩放學（5公里）", y: 3.2 },
    { time: "17:30", loc: "東區", desc: "接長輩回家（6公里）", y: 3.8 },
    { time: "18:30", loc: "回家", desc: "終於到家（2公里）", y: 4.4 }
];

journey.forEach((step) => {
    slide2.addShape(pres.ShapeType.rect, {
        x: 5.5, y: step.y, w: 4.0, h: 0.5,
        fill: { color: "FFF3E0" },
        line: { color: COLORS.accent, width: 2 }
    });
    slide2.addText(`${step.time} ${step.loc}`, {
        x: 5.6, y: step.y + 0.08, w: 1.8, h: 0.35,
        fontSize: 11, bold: true, color: COLORS.accent,
        fontFace: "Arial"
    });
    slide2.addText(step.desc, {
        x: 7.5, y: step.y + 0.08, w: 1.9, h: 0.35,
        fontSize: 10, color: COLORS.black,
        fontFace: "Arial"
    });
});

// 總計框
slide2.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.55, w: 4.5, h: 0.5,
    fill: { type: "solid", color: COLORS.accent }
});
slide2.addText("每日總計：32公里 | 2小時 | 精疲力竭", {
    x: 0.5, y: 4.65, w: 4.5, h: 0.3,
    fontSize: 17, bold: true, color: COLORS.white,
    align: "center", valign: "middle", fontFace: "Arial"
});

slide2.addText("資料來源：hackathon_data_summary.md（痛點分類Line 34-44）| 紮根理論三層編碼分析", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide2.addText("2 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第3頁：解決方案（改進：添加動線說明） ====================
console.log("✓ 創建第3頁：解決方案");
let slide3 = pres.addSlide();
slide3.background = { color: COLORS.white };

slide3.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { type: "solid", color: COLORS.secondary }
});
slide3.addText("赤土崎全齡社福樞紐：用「一館」解決「三代」的時間貧窮", {
    x: 0.5, y: 0.18, w: 9.0, h: 0.4,
    fontSize: 23, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 建築配置
const floors = [
    { name: "4F 青少年活動中心", info: "30-40人 | 17:00-21:00", y: 1.0, color: "E3F2FD" },
    { name: "3F 家庭支持服務", info: "20-30人 | 18:00-21:00", y: 1.65, color: "F3E5F5" },
    { name: "2F 公共托嬰中心", info: "40-50人 | 07:30-17:30", y: 2.3, color: "FFF3E0" },
    { name: "1F 長照日照中心", info: "50-60人 | 09:00-17:00", y: 2.95, color: "E8F5E9" },
    { name: "B1 停車場+設備層", info: "30車位 | 全日開放", y: 3.6, color: "EEEEEE" }
];

floors.forEach(floor => {
    slide3.addShape(pres.ShapeType.rect, {
        x: 0.5, y: floor.y, w: 4.0, h: 0.6,
        fill: { color: floor.color },
        line: { color: COLORS.primary, width: 2 }
    });
    slide3.addText(floor.name, {
        x: 0.6, y: floor.y + 0.1, w: 3.8, h: 0.22,
        fontSize: 13, bold: true, color: COLORS.primary,
        fontFace: "Arial"
    });
    slide3.addText(floor.info, {
        x: 0.6, y: floor.y + 0.35, w: 3.8, h: 0.2,
        fontSize: 10, color: COLORS.black,
        fontFace: "Arial"
    });
});

// 一站式動線說明（改進項）
slide3.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.3, w: 4.0, h: 0.85,
    fill: { color: "FFF9E6" },
    line: { color: COLORS.gold, width: 3 }
});
slide3.addText("⭐ 一站式接送動線", {
    x: 0.6, y: 4.4, w: 3.8, h: 0.2,
    fontSize: 13, bold: true, color: COLORS.accent,
    fontFace: "Arial"
});
slide3.addText("早上：1F送長輩 → 2F送小孩 → 竹科上班\n傍晚：竹科下班 → 2F接小孩 → 1F接長輩\n晚上：4F青少年活動（家長可在3F諮詢）", {
    x: 0.7, y: 4.65, w: 3.6, h: 0.45,
    fontSize: 9, color: COLORS.black,
    fontFace: "Arial"
});

// 核心數據卡片
const coreStats = [
    { num: "3,100 m²", desc: "總樓地板面積\n(940坪)", x: 5.0, y: 1.15 },
    { num: "B1+4F", desc: "5層建築\n整合設計", x: 7.3, y: 1.15 },
    { num: "140-180人", desc: "每日服務\n人數", x: 5.0, y: 2.9 },
    { num: "29人", desc: "專業工作\n團隊", x: 7.3, y: 2.9 }
];

coreStats.forEach(stat => {
    slide3.addShape(pres.ShapeType.rect, {
        x: stat.x, y: stat.y, w: 2.0, h: 1.5,
        fill: { color: "E8F5E9" },
        line: { color: COLORS.secondary, width: 3 }
    });
    slide3.addText(stat.num, {
        x: stat.x, y: stat.y + 0.3, w: 2.0, h: 0.5,
        fontSize: 24, bold: true, color: COLORS.secondary,
        align: "center", fontFace: "Arial"
    });
    slide3.addText(stat.desc, {
        x: stat.x, y: stat.y + 0.85, w: 2.0, h: 0.5,
        fontSize: 11, color: COLORS.black,
        align: "center", fontFace: "Arial"
    });
});

slide3.addText("資料來源：architectural-floor-plans-2025.md (Line 13-31, 1425-1437)", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide3.addText("3 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第4頁：創新亮點（改進：術語白話化） ====================
console.log("✓ 創建第4頁：創新亮點");
let slide4 = pres.addSlide();
slide4.background = { color: COLORS.white };

slide4.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: COLORS.accent }
});
slide4.addText("台灣首創：失智日照 + 公托 + 青少年中心 三合一", {
    x: 0.5, y: 0.2, w: 9.0, h: 0.35,
    fontSize: 23, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 左側：技術特色（白話化改進）
const features = [
    {
        title: "🔊 隔音設計（CDC 2025標準）",
        items: [
            "STC 65隔音牆 = 「隔壁大哭聽不見」",
            "IIC 70地板 = 「樓上籃球聽不見」",
            "1F失智專區 vs 2F幼兒區：降噪40-45 dB"
        ],
        y: 0.95,
        color: "E3F2FD"
    },
    {
        title: "🍽️ 分時共享策略",
        items: [
            "共用餐廳錯峰：11:30長者/12:00幼兒（錯開30分）",
            "社區廚房：日間130人供餐/夜間親子烹飪課"
        ],
        y: 1.95,
        color: "FFF3E0"
    },
    {
        title: "🤝 跨齡互動時段",
        items: [
            "每週五10:00-11:00：長者+幼兒園藝活動",
            "每月第3週日：三代同堂節慶活動",
            "每季1次：青少年為長者錄製生命故事"
        ],
        y: 2.8,
        color: "E8F5E9"
    }
];

features.forEach(feature => {
    slide4.addShape(pres.ShapeType.rect, {
        x: 0.5, y: feature.y, w: 4.5, h: 0.85,
        fill: { color: feature.color },
        line: { color: COLORS.primary, width: 2 }
    });
    slide4.addText(feature.title, {
        x: 0.6, y: feature.y + 0.08, w: 4.3, h: 0.22,
        fontSize: 12, bold: true, color: COLORS.primary,
        fontFace: "Arial"
    });

    let yOffset = 0.35;
    feature.items.forEach(item => {
        slide4.addText("• " + item, {
            x: 0.7, y: feature.y + yOffset, w: 4.2, h: 0.14,
            fontSize: 9, color: COLORS.black,
            fontFace: "Arial"
        });
        yOffset += 0.15;
    });
});

// 右側：國際實證
slide4.addShape(pres.ShapeType.rect, {
    x: 5.2, y: 0.95, w: 4.3, h: 1.95,
    fill: { color: "E3F2FD" },
    line: { color: COLORS.primary, width: 2 }
});
slide4.addText("國際實證基礎", {
    x: 5.3, y: 1.05, w: 4.1, h: 0.25,
    fontSize: 15, bold: true, color: COLORS.primary,
    fontFace: "Arial"
});

const intlCases = [
    { flag: "🇯🇵", title: "日本共生型服務（2018年實施）", desc: "運作6年，感染率未增加", y: 1.4 },
    { flag: "🇳🇱", title: "荷蘭 Humanitas 跨代護理之家", desc: "160位長者 + 6位大學生共居10年+", y: 1.95 },
    { flag: "🇹🇼", title: "台灣老幼共學（2016年起）", desc: "高雄、台北、新北多處成功案例", y: 2.5 }
];

intlCases.forEach(c => {
    slide4.addText(`${c.flag} ${c.title}`, {
        x: 5.3, y: c.y, w: 4.1, h: 0.18,
        fontSize: 10, bold: true, color: COLORS.black,
        fontFace: "Arial"
    });
    slide4.addText(c.desc, {
        x: 5.4, y: c.y + 0.2, w: 4.0, h: 0.15,
        fontSize: 9, color: COLORS.gray,
        fontFace: "Arial"
    });
});

// 技術規格
slide4.addShape(pres.ShapeType.rect, {
    x: 5.2, y: 3.05, w: 4.3, h: 1.1,
    fill: { color: COLORS.lightGray },
    line: { color: COLORS.primary, width: 2 }
});
slide4.addText("技術規格亮點", {
    x: 5.3, y: 3.15, w: 4.1, h: 0.22,
    fontSize: 13, bold: true, color: COLORS.primary,
    fontFace: "Arial"
});
slide4.addText("✓ HEPA H13過濾 - 99.97%病毒與PM2.5過濾\n✓ 獨立空調系統 - 1F、2F各獨立防交叉感染\n✓ 智慧監控系統 - 跌倒偵測、生理監測、家長APP", {
    x: 5.4, y: 3.45, w: 4.0, h: 0.6,
    fontSize: 9, color: COLORS.black,
    fontFace: "Arial"
});

// 感染控制補充（改進項）
slide4.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 3.8, w: 4.5, h: 0.5,
    fill: { color: "E8F5E9" },
    line: { color: COLORS.secondary, width: 2 }
});
slide4.addText("✓ 感染控制SOP：錯峰用餐、共用空間每日紫外線消毒、進出體溫監測", {
    x: 0.6, y: 3.9, w: 4.3, h: 0.3,
    fontSize: 9, color: COLORS.black,
    fontFace: "Arial"
});

slide4.addText("資料來源：cross-age-integration-design-2025.md (Line 30-54) | architectural-floor-plans-2025.md", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide4.addText("4 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第5頁：政策對接（改進：強化緊迫感） ====================
console.log("✓ 創建第5頁：政策對接");
let slide5 = pres.addSlide();
slide5.background = { color: COLORS.white };

slide5.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: COLORS.warning }
});
slide5.addText("🔥 10/30標案開標（本週三！）", {
    x: 0.5, y: 0.12, w: 9.0, h: 0.3,
    fontSize: 26, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide5.addText("設計階段影響功能的最後窗口 - 錯過就等下一個5年", {
    x: 0.5, y: 0.45, w: 9.0, h: 0.28,
    fontSize: 16, bold: true, color: COLORS.gold,
    align: "center", fontFace: "Arial"
});

// 時間軸
const timeline = [
    { date: "2025/10/07", title: "標案公告 ✓", status: "completed", desc: "114A109 | 2,287萬元", y: 1.0 },
    { date: "2025/10/30", title: "開標（本週三）🔥", status: "active", desc: "規劃設計及監造技術服務案", y: 1.6 },
    { date: "2025/11 - 2026/04", title: "黃金窗口", status: "pending", desc: "規劃設計階段（6個月）← 納入全齡整合功能", y: 2.2 },
    { date: "2026/05 - 2027/06", title: "工程施工", status: "pending", desc: "主體工程（14個月）", y: 2.8 },
    { date: "2027/07", title: "正式營運", status: "pending", desc: "試營運2個月後全面啟用", y: 3.4 }
];

timeline.forEach(item => {
    let bgColor = item.status === "completed" ? "E8F5E9" :
                  item.status === "active" ? "FFE0B2" : COLORS.lightGray;
    let borderColor = item.status === "completed" ? COLORS.secondary :
                      item.status === "active" ? COLORS.warning : COLORS.gray;

    slide5.addShape(pres.ShapeType.rect, {
        x: 0.5, y: item.y, w: 5.5, h: 0.5,
        fill: { color: bgColor },
        line: { color: borderColor, width: item.status === "active" ? 4 : 2 }
    });

    slide5.addText(item.date, {
        x: 0.6, y: item.y + 0.05, w: 5.3, h: 0.18,
        fontSize: 12, bold: true, color: borderColor,
        fontFace: "Arial"
    });
    slide5.addText(item.title + " - " + item.desc, {
        x: 0.6, y: item.y + 0.25, w: 5.3, h: 0.2,
        fontSize: 9, color: COLORS.black,
        fontFace: "Arial"
    });
});

// 右側：財劃法影響
slide5.addShape(pres.ShapeType.rect, {
    x: 6.2, y: 1.0, w: 3.3, h: 1.75,
    fill: { color: "E3F2FD" },
    line: { color: COLORS.primary, width: 2 }
});
slide5.addText("財劃法修正影響", {
    x: 6.3, y: 1.1, w: 3.1, h: 0.28,
    fontSize: 15, bold: true, color: COLORS.primary,
    align: "center", fontFace: "Arial"
});
slide5.addText("修法前（114年）", {
    x: 6.3, y: 1.45, w: 3.1, h: 0.18,
    fontSize: 11, bold: true, color: COLORS.black,
    align: "center", fontFace: "Arial"
});
slide5.addText("83億", {
    x: 6.3, y: 1.65, w: 3.1, h: 0.32,
    fontSize: 30, bold: true, color: COLORS.gray,
    align: "center", fontFace: "Arial"
});
slide5.addText("修法後（115年）", {
    x: 6.3, y: 2.0, w: 3.1, h: 0.18,
    fontSize: 11, bold: true, color: COLORS.black,
    align: "center", fontFace: "Arial"
});
slide5.addText("293億", {
    x: 6.3, y: 2.2, w: 3.1, h: 0.35,
    fontSize: 34, bold: true, color: COLORS.secondary,
    align: "center", fontFace: "Arial"
});
slide5.addText("增加+210億（+253%）", {
    x: 6.3, y: 2.58, w: 3.1, h: 0.15,
    fontSize: 10, bold: true, color: COLORS.accent,
    align: "center", fontFace: "Arial"
});

// 三館對比表
slide5.addShape(pres.ShapeType.rect, {
    x: 6.2, y: 2.9, w: 3.3, h: 1.4,
    fill: { color: COLORS.lightGray },
    line: { color: COLORS.gray, width: 1 }
});
slide5.addText("三館規劃進度對比", {
    x: 6.3, y: 3.0, w: 3.1, h: 0.22,
    fontSize: 13, bold: true, color: COLORS.primary,
    align: "center", fontFace: "Arial"
});

const comparison = [
    { name: "赤土崎多功能館", status: "✓✓✓ 已發包", color: COLORS.secondary, y: 3.3 },
    { name: "兒少家庭福利館", status: "⚠ 選址未定", color: COLORS.accent, y: 3.65 },
    { name: "少年福利服務中心", status: "⚠ 規劃階段", color: COLORS.accent, y: 4.0 }
];

comparison.forEach(item => {
    slide5.addText(item.name, {
        x: 6.35, y: item.y, w: 1.8, h: 0.25,
        fontSize: 9, color: COLORS.black,
        fontFace: "Arial"
    });
    slide5.addText(item.status, {
        x: 8.2, y: item.y, w: 1.2, h: 0.25,
        fontSize: 8, bold: true, color: item.color,
        align: "right", fontFace: "Arial"
    });
});

slide5.addText("資料來源：Xin-Zhu-Shi-Zheng-Fu-Biao-An-Fen-Xi.md | 台灣政府電子採購網 | CLAUDE.md (Line 16-38)", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide5.addText("5 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第6頁：財務可行性（改進：風險應對） ====================
console.log("✓ 創建第6頁：財務可行性");
let slide6 = pres.addSlide();
slide6.background = { color: COLORS.white };

slide6.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: COLORS.secondary }
});
slide6.addText("2.3億預算，月淨收入+51.9萬，SROI 1:2.04", {
    x: 0.5, y: 0.18, w: 9.0, h: 0.4,
    fontSize: 24, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 左側：預算卡片
slide6.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.95, w: 3.0, h: 1.2,
    fill: { color: "E8F5E9" },
    line: { color: COLORS.secondary, width: 3 }
});
slide6.addText("總預算規模", {
    x: 0.5, y: 1.05, w: 3.0, h: 0.22,
    fontSize: 15, bold: true, color: COLORS.secondary,
    align: "center", fontFace: "Arial"
});
slide6.addText("2.3億", {
    x: 0.5, y: 1.32, w: 3.0, h: 0.45,
    fontSize: 40, bold: true, color: COLORS.secondary,
    align: "center", fontFace: "Arial"
});
slide6.addText("新竹市65.2% + 中央14.6%\n+ 企業ESG 3.4%", {
    x: 0.6, y: 1.8, w: 2.8, h: 0.28,
    fontSize: 9, color: COLORS.black,
    align: "center", fontFace: "Arial"
});

// 月收入表
slide6.addShape(pres.ShapeType.rect, {
    x: 3.7, y: 0.95, w: 3.0, h: 1.7,
    fill: { color: "E8F5E9" },
    line: { color: COLORS.secondary, width: 2 }
});
slide6.addText("月度收入（穩定運營後）", {
    x: 3.8, y: 1.0, w: 2.8, h: 0.22,
    fontSize: 13, bold: true, color: COLORS.secondary,
    fontFace: "Arial"
});

const income = [
    { item: "日照中心（55人）", amt: "145.2萬", y: 1.3 },
    { item: "托嬰中心（45人）", amt: "65.3萬", y: 1.58 },
    { item: "青少年中心（補助）", amt: "12.5萬", y: 1.86 },
    { item: "場地租借 + 停車", amt: "20.0萬", y: 2.14 }
];

income.forEach(row => {
    slide6.addText(row.item, {
        x: 3.85, y: row.y, w: 1.9, h: 0.18,
        fontSize: 9, color: COLORS.black,
        fontFace: "Arial"
    });
    slide6.addText(row.amt, {
        x: 5.8, y: row.y, w: 0.7, h: 0.18,
        fontSize: 9, bold: true, color: COLORS.black,
        align: "right", fontFace: "Arial"
    });
});

slide6.addShape(pres.ShapeType.rect, {
    x: 3.85, y: 2.43, w: 2.7, h: 0.04,
    fill: { color: COLORS.secondary }
});
slide6.addText("總月收入", {
    x: 3.85, y: 2.48, w: 1.9, h: 0.14,
    fontSize: 10, bold: true, color: COLORS.black,
    fontFace: "Arial"
});
slide6.addText("243.0萬", {
    x: 5.8, y: 2.48, w: 0.7, h: 0.14,
    fontSize: 10, bold: true, color: COLORS.secondary,
    align: "right", fontFace: "Arial"
});

// 月支出表
slide6.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 2.3, w: 3.0, h: 1.35,
    fill: { color: "FFF3E0" },
    line: { color: COLORS.accent, width: 2 }
});
slide6.addText("月度支出", {
    x: 0.6, y: 2.38, w: 2.8, h: 0.22,
    fontSize: 13, bold: true, color: COLORS.accent,
    fontFace: "Arial"
});

const expense = [
    { item: "人事成本（29人）", amt: "145.0萬", y: 2.68 },
    { item: "水電瓦斯", amt: "18.0萬", y: 2.91 },
    { item: "設備維護+食材耗材", amt: "27.0萬", y: 3.14 }
];

expense.forEach(row => {
    slide6.addText(row.item, {
        x: 0.65, y: row.y, w: 1.8, h: 0.16,
        fontSize: 9, color: COLORS.black,
        fontFace: "Arial"
    });
    slide6.addText(row.amt, {
        x: 2.6, y: row.y, w: 0.7, h: 0.16,
        fontSize: 9, bold: true, color: COLORS.black,
        align: "right", fontFace: "Arial"
    });
});

slide6.addShape(pres.ShapeType.rect, {
    x: 0.65, y: 3.38, w: 2.7, h: 0.04,
    fill: { color: COLORS.accent }
});
slide6.addText("總月支出", {
    x: 0.65, y: 3.43, w: 1.8, h: 0.14,
    fontSize: 10, bold: true, color: COLORS.black,
    fontFace: "Arial"
});
slide6.addText("191.0萬", {
    x: 2.6, y: 3.43, w: 0.7, h: 0.14,
    fontSize: 10, bold: true, color: COLORS.accent,
    align: "right", fontFace: "Arial"
});

// 右側：關鍵指標
slide6.addShape(pres.ShapeType.rect, {
    x: 6.9, y: 0.95, w: 2.6, h: 1.1,
    fill: { color: COLORS.primary },
    line: { type: "none" }
});
slide6.addText("月淨收入", {
    x: 6.9, y: 1.05, w: 2.6, h: 0.22,
    fontSize: 13, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide6.addText("+51.9萬", {
    x: 6.9, y: 1.32, w: 2.6, h: 0.45,
    fontSize: 34, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide6.addText("年盈餘 623萬元\n投資回收期 5.8年", {
    x: 6.9, y: 1.8, w: 2.6, h: 0.22,
    fontSize: 10, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

slide6.addShape(pres.ShapeType.rect, {
    x: 6.9, y: 2.2, w: 2.6, h: 1.1,
    fill: { color: COLORS.accent },
    line: { type: "none" }
});
slide6.addText("社會投資報酬率", {
    x: 6.9, y: 2.3, w: 2.6, h: 0.22,
    fontSize: 13, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide6.addText("1:2.04", {
    x: 6.9, y: 2.57, w: 2.6, h: 0.45,
    fontSize: 38, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide6.addText("每投入1元，創造2.04元社會價值", {
    x: 6.9, y: 3.05, w: 2.6, h: 0.18,
    fontSize: 8, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 風險應對（改進項）
slide6.addShape(pres.ShapeType.rect, {
    x: 6.9, y: 3.4, w: 2.6, h: 0.95,
    fill: { color: "E8F5E9" },
    line: { color: COLORS.secondary, width: 2 }
});
slide6.addText("✓ 財務風險應對", {
    x: 7.0, y: 3.5, w: 2.4, h: 0.2,
    fontSize: 11, bold: true, color: COLORS.secondary,
    fontFace: "Arial"
});
slide6.addText("• 80%收托率即可收支平衡\n• 新竹縣案例：6個月達80%\n• 預留2個月營運準備金", {
    x: 7.05, y: 3.75, w: 2.35, h: 0.5,
    fontSize: 8, color: COLORS.black,
    fontFace: "Arial"
});

// 社會價值產出
slide6.addShape(pres.ShapeType.rect, {
    x: 3.7, y: 2.8, w: 3.0, h: 0.85,
    fill: { color: "E3F2FD" },
    line: { color: COLORS.primary, width: 1 }
});
slide6.addText("社會價值產出（每年）", {
    x: 3.8, y: 2.9, w: 2.8, h: 0.22,
    fontSize: 12, bold: true, color: COLORS.primary,
    fontFace: "Arial"
});
slide6.addText("• 時間節省：1.2億元 = 1,000家庭每年多730小時親子時間\n• 關係改善：3,600萬元\n• 健康促進：2,400萬元", {
    x: 3.85, y: 3.18, w: 2.7, h: 0.42,
    fontSize: 8, color: COLORS.black,
    fontFace: "Arial"
});

slide6.addText("資料來源：policy-docking-and-financial-model.md (Line 8-14, 231-296) | SROI：台灣社會影響力研究院標準", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide6.addText("6 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第7頁：標竿驗證（改進：成本節省說明） ====================
console.log("✓ 創建第7頁：標竿驗證");
let slide7 = pres.addSlide();
slide7.background = { color: COLORS.white };

slide7.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: COLORS.purple }
});
slide7.addText("新竹縣綜合社福館（2.8億，2023營運）證實模式可行", {
    x: 0.5, y: 0.2, w: 9.0, h: 0.35,
    fontSize: 22, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

slide7.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.88, w: 9.0, h: 0.45,
    fill: { color: "F3E5F5" },
    line: { color: COLORS.purple, width: 3 }
});
slide7.addText("不是異想天開，而是有前例可循 — 新竹縣已經做了，新竹市可以做得更好", {
    x: 0.6, y: 0.97, w: 8.8, h: 0.28,
    fontSize: 13, bold: true, color: COLORS.black,
    align: "center", fontFace: "Arial"
});

// 對比表格
const benchmarkRows = [
    { item: "預算規模", county: "2.8億元", ours: "2.3億元 ⭐ 節省5,000萬", highlight: true, y: 1.5 },
    { item: "樓層數", county: "4層（無地下）", ours: "B1+4F（5層）✓ 多停車場", highlight: false, y: 1.87 },
    { item: "整合功能", county: "托嬰+親子+兒少", ours: "托嬰+親子+兒少+長照 ⭐ 多1項", highlight: true, y: 2.24 },
    { item: "服務人數", county: "約150人/日", ours: "140-180人/日 ✓", highlight: false, y: 2.61 },
    { item: "跨齡設計", county: "無明確跨齡活動", ours: "固定時段跨齡互動 ⭐", highlight: true, y: 2.98 },
    { item: "SROI", county: "未公開", ours: "1:2.04 ⭐ 數據透明", highlight: false, y: 3.35 },
    { item: "營運狀況", county: "收支平衡 ✓\n收托率95%\n滿意度4.2/5.0", ours: "預計收支平衡\n月淨收入+51.9萬\n年盈餘623萬", highlight: true, y: 3.72 }
];

// 表格標題
slide7.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 1.38, w: 9.0, h: 0.32,
    fill: { color: COLORS.purple }
});
slide7.addText("比較項目", {
    x: 0.5, y: 1.42, w: 2.5, h: 0.25,
    fontSize: 11, bold: true, color: COLORS.white,
    align: "center", valign: "middle", fontFace: "Arial"
});
slide7.addText("新竹縣綜合社福館", {
    x: 3.0, y: 1.42, w: 3.0, h: 0.25,
    fontSize: 11, bold: true, color: COLORS.white,
    align: "center", valign: "middle", fontFace: "Arial"
});
slide7.addText("赤土崎全齡樞紐（本提案）", {
    x: 6.0, y: 1.42, w: 3.5, h: 0.25,
    fontSize: 11, bold: true, color: COLORS.white,
    align: "center", valign: "middle", fontFace: "Arial"
});

benchmarkRows.forEach(row => {
    let bgColor = row.highlight ? "FFF3E0" : COLORS.white;

    slide7.addShape(pres.ShapeType.rect, {
        x: 0.5, y: row.y, w: 9.0, h: 0.32,
        fill: { color: bgColor },
        line: { color: "E0E0E0", width: 1 }
    });

    slide7.addText(row.item, {
        x: 0.6, y: row.y, w: 2.3, h: 0.32,
        fontSize: 9, bold: true, color: COLORS.black,
        valign: "middle", fontFace: "Arial"
    });
    slide7.addText(row.county, {
        x: 3.1, y: row.y, w: 2.8, h: 0.32,
        fontSize: 8, color: COLORS.black,
        align: "center", valign: "middle", fontFace: "Arial"
    });
    slide7.addText(row.ours, {
        x: 6.1, y: row.y, w: 3.3, h: 0.32,
        fontSize: 8, color: COLORS.black,
        align: "center", valign: "middle", fontFace: "Arial"
    });
});

// 成本節省說明（改進項）
slide7.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.3, w: 9.0, h: 0.65,
    fill: { color: "E8F5E9" },
    line: { color: COLORS.secondary, width: 2 }
});
slide7.addText("💰 成本節省來源：共用餐廳（錯峰使用）、共用活動空間、整合管理團隊（統一排班）", {
    x: 0.6, y: 4.45, w: 8.8, h: 0.35,
    fontSize: 10, bold: true, color: COLORS.secondary,
    align: "center", fontFace: "Arial"
});

slide7.addText("資料來源：新竹縣政府社會處、綜合社福館營運報告（2024年中）| CLAUDE.md標竿分析章節", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide7.addText("7 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第8頁：實施路徑 ====================
console.log("✓ 創建第8頁：實施路徑");
let slide8 = pres.addSlide();
slide8.background = { color: COLORS.white };

slide8.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.75,
    fill: { color: COLORS.lightBlue }
});
slide8.addText("從標案到營運：18個月實施路徑", {
    x: 0.5, y: 0.2, w: 9.0, h: 0.35,
    fontSize: 26, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 4個階段
const phases = [
    {
        title: "階段1：規劃設計（6個月）",
        period: "2025/11 - 2026/04 | 預算：2,287萬元",
        items: [
            "建築師簽約（決標後1週）",
            "需求訪談（社區說明會3場、訪談30人）",
            "初步設計 → 細部設計 → 審查通過"
        ],
        deliverable: "交付：完整施工圖說 + 工程預算書",
        y: 0.95,
        highlight: true
    },
    {
        title: "階段2：工程施工（14個月）",
        period: "2026/05 - 2027/06 | 預算：2.0億元",
        items: [
            "地質調查 → 主體結構（6個月）",
            "機電設備安裝（3個月）",
            "室內裝修 → 景觀 → 驗收測試"
        ],
        deliverable: "交付：使用執照 + 消防安檢合格證",
        y: 1.9,
        highlight: false
    },
    {
        title: "階段3：人員招募與訓練（3個月，並行）",
        period: "2027/04 - 2027/06 | 預算：300萬元 + 新竹縣見習",
        items: [
            "招募29人（護理師、教保員、照服員）",
            "職前訓練、設備操作訓練",
            "派員至新竹縣社福館見習1個月（快速上手）"
        ],
        deliverable: "交付：服務手冊 + SOP文件",
        y: 2.85,
        highlight: false
    },
    {
        title: "階段4：試營運與正式營運",
        period: "2027/07 試營運 | 2027/09 正式營運",
        items: [
            "試營運2個月：收托率50%",
            "正式營運目標：6個月達80%，12個月達95%"
        ],
        deliverable: "",
        y: 3.8,
        highlight: false
    }
];

phases.forEach(phase => {
    let bgColor = phase.highlight ? "E3F2FD" : COLORS.lightGray;
    let borderColor = phase.highlight ? COLORS.accent : COLORS.lightBlue;

    slide8.addShape(pres.ShapeType.rect, {
        x: 0.5, y: phase.y, w: 6.5, h: 0.8,
        fill: { color: bgColor },
        line: { color: borderColor, width: phase.highlight ? 3 : 2 }
    });

    slide8.addText(phase.title, {
        x: 0.6, y: phase.y + 0.06, w: 6.3, h: 0.18,
        fontSize: 12, bold: true, color: borderColor,
        fontFace: "Arial"
    });
    slide8.addText(phase.period, {
        x: 0.6, y: phase.y + 0.24, w: 6.3, h: 0.14,
        fontSize: 9, bold: true, color: COLORS.black,
        fontFace: "Arial"
    });

    let itemText = phase.items.map(item => "• " + item).join("\n");
    slide8.addText(itemText, {
        x: 0.7, y: phase.y + 0.4, w: 6.2, h: 0.27,
        fontSize: 8, color: COLORS.black,
        fontFace: "Arial"
    });

    if (phase.deliverable) {
        slide8.addText(phase.deliverable, {
            x: 0.7, y: phase.y + 0.68, w: 6.1, h: 0.1,
            fontSize: 8, bold: true, color: COLORS.secondary,
            fontFace: "Arial"
        });
    }
});

// 右側：關鍵里程碑
slide8.addShape(pres.ShapeType.rect, {
    x: 7.2, y: 0.95, w: 2.3, h: 2.7,
    fill: { color: COLORS.accent },
    line: { type: "none" }
});
slide8.addText("關鍵里程碑", {
    x: 7.2, y: 1.05, w: 2.3, h: 0.22,
    fontSize: 14, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

const milestones = [
    { date: "2025/10/30", event: "標案開標 🔥", y: 1.35 },
    { date: "2025/12/01", event: "建築師簽約", y: 1.68 },
    { date: "2026/04/30", event: "施工圖審查通過", y: 2.01 },
    { date: "2026/05/15", event: "工程開工", y: 2.34 },
    { date: "2027/06/30", event: "工程完工驗收", y: 2.67 },
    { date: "2027/09/01", event: "正式營運", y: 3.0 },
    { date: "2028/09/01", event: "收支平衡、滿載", y: 3.33 }
];

milestones.forEach(m => {
    slide8.addShape(pres.ShapeType.rect, {
        x: 7.3, y: m.y, w: 2.1, h: 0.23,
        fill: { color: "FFFFFF", transparency: 20 },
        line: { type: "none" }
    });
    slide8.addText(m.date, {
        x: 7.35, y: m.y + 0.02, w: 2.0, h: 0.09,
        fontSize: 8, bold: true, color: COLORS.white,
        fontFace: "Arial"
    });
    slide8.addText(m.event, {
        x: 7.35, y: m.y + 0.12, w: 2.0, h: 0.09,
        fontSize: 7, color: COLORS.white,
        fontFace: "Arial"
    });
});

// 品質把關
slide8.addShape(pres.ShapeType.rect, {
    x: 7.2, y: 3.8, w: 2.3, h: 0.8,
    fill: { color: "E8F5E9" },
    line: { color: COLORS.secondary, width: 2 }
});
slide8.addText("品質把關機制", {
    x: 7.3, y: 3.9, w: 2.1, h: 0.18,
    fontSize: 11, bold: true, color: COLORS.secondary,
    fontFace: "Arial"
});
slide8.addText("✓ 每階段獨立驗收\n✓ 風險管理與應變\n✓ 社區溝通與參與\n✓ 專案進度月報", {
    x: 7.35, y: 4.13, w: 2.0, h: 0.4,
    fontSize: 8, color: COLORS.black,
    fontFace: "Arial"
});

slide8.addText("資料來源：10-page-hackathon-presentation-outline.md (Line 903-1007) | 專案管理標準流程", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.gray,
    fontFace: "Arial"
});

slide8.addText("8 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.gray,
    align: "right", fontFace: "Arial"
});

// ==================== 第9頁：社會影響 ====================
console.log("✓ 創建第9頁：社會影響");
let slide9 = pres.addSlide();
slide9.background = { color: COLORS.primary };

slide9.addText("從赤土崎到全台灣：可複製的社福整合模式", {
    x: 0.5, y: 0.45, w: 9.0, h: 0.5,
    fontSize: 24, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 三大影響卡片
const impacts = [
    {
        title: "直接影響",
        number: "1,000",
        unit: "服務家庭數/年",
        items: ["3,500人受惠", "節省73萬小時", "2.19億元社會價值"],
        x: 0.5,
        y: 1.15
    },
    {
        title: "間接影響",
        number: "10萬",
        unit: "科學園區家庭總數",
        items: ["竹科：5萬家庭", "中科：3萬家庭", "南科：2.5萬家庭"],
        x: 3.5,
        y: 1.15
    },
    {
        title: "擴展潛力",
        number: "15億",
        unit: "總社會價值（若複製7處）",
        items: ["7,000家庭/年", "511萬小時節省", "國際示範效應"],
        x: 6.5,
        y: 1.15
    }
];

impacts.forEach(impact => {
    slide9.addShape(pres.ShapeType.rect, {
        x: impact.x, y: impact.y, w: 2.8, h: 1.4,
        fill: { color: COLORS.white, transparency: 5 },
        line: { type: "none" }
    });
    slide9.addText(impact.title, {
        x: impact.x, y: impact.y + 0.08, w: 2.8, h: 0.22,
        fontSize: 14, bold: true, color: COLORS.primary,
        align: "center", fontFace: "Arial"
    });
    slide9.addText(impact.number, {
        x: impact.x, y: impact.y + 0.35, w: 2.8, h: 0.45,
        fontSize: 36, bold: true, color: COLORS.accent,
        align: "center", fontFace: "Arial"
    });
    slide9.addText(impact.unit, {
        x: impact.x, y: impact.y + 0.82, w: 2.8, h: 0.18,
        fontSize: 10, bold: true, color: COLORS.black,
        align: "center", fontFace: "Arial"
    });
    let itemsText = impact.items.map(item => "• " + item).join("\n");
    slide9.addText(itemsText, {
        x: impact.x + 0.1, y: impact.y + 1.05, w: 2.6, h: 0.28,
        fontSize: 8, color: COLORS.black,
        fontFace: "Arial"
    });
});

// 複製地點
slide9.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 2.7, w: 6.0, h: 1.6,
    fill: { color: COLORS.white, transparency: 5 },
    line: { type: "none" }
});
slide9.addText("潛在複製地點（科學園區周邊）", {
    x: 0.6, y: 2.8, w: 5.8, h: 0.28,
    fontSize: 15, bold: true, color: COLORS.secondary,
    fontFace: "Arial"
});

const locations = [
    { icon: "🏭", name: "新竹科學園區", places: "竹科X園區、寶山園區（2處）", y: 3.15 },
    { icon: "🏭", name: "台中科學園區", places: "中科、精密園區（2處）", y: 3.6 },
    { icon: "🏭", name: "台南科學園區", places: "南科、橋頭園區（2處）", y: 4.05 }
];

locations.forEach(loc => {
    slide9.addShape(pres.ShapeType.rect, {
        x: 0.7, y: loc.y, w: 5.6, h: 0.38,
        fill: { color: "E8F5E9" },
        line: { color: COLORS.secondary, width: 2 }
    });
    slide9.addText(`${loc.icon} ${loc.name}`, {
        x: 0.8, y: loc.y + 0.05, w: 5.4, h: 0.14,
        fontSize: 11, bold: true, color: COLORS.secondary,
        fontFace: "Arial"
    });
    slide9.addText(loc.places, {
        x: 0.8, y: loc.y + 0.2, w: 5.4, h: 0.14,
        fontSize: 9, color: COLORS.black,
        fontFace: "Arial"
    });
});

// 總計卡片
slide9.addShape(pres.ShapeType.rect, {
    x: 6.7, y: 2.7, w: 2.8, h: 1.1,
    fill: { color: COLORS.accent },
    line: { type: "none" }
});
slide9.addText("若複製7處", {
    x: 6.7, y: 2.82, w: 2.8, h: 0.18,
    fontSize: 12, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide9.addText("7,000", {
    x: 6.7, y: 3.05, w: 2.8, h: 0.45,
    fontSize: 34, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide9.addText("服務家庭數/年", {
    x: 6.7, y: 3.52, w: 2.8, h: 0.14,
    fontSize: 9, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide9.addText("24,500人受惠 | 511萬小時節省", {
    x: 6.7, y: 3.67, w: 2.8, h: 0.12,
    fontSize: 7, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 政策影響
slide9.addShape(pres.ShapeType.rect, {
    x: 6.7, y: 3.95, w: 2.8, h: 0.65,
    fill: { color: "E3F2FD" },
    line: { color: COLORS.primary, width: 2 }
});
slide9.addText("政策影響", {
    x: 6.8, y: 4.05, w: 2.6, h: 0.18,
    fontSize: 11, bold: true, color: COLORS.primary,
    fontFace: "Arial"
});
slide9.addText("✓ 推動「共生型服務」立法\n✓ 納入長照3.0策略\n✓ 國際輸出典範", {
    x: 6.85, y: 4.27, w: 2.5, h: 0.3,
    fontSize: 8, color: COLORS.black,
    fontFace: "Arial"
});

// 擴展條件補充（改進項）
slide9.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 4.5, w: 6.0, h: 0.55,
    fill: { color: COLORS.gold, transparency: 20 },
    line: { color: COLORS.gold, width: 2 }
});
slide9.addText("⭐ 擴展條件：赤土崎案成功營運1年 → 建立SOP手冊 → 科技部補助計畫（每處1億）", {
    x: 0.6, y: 4.62, w: 5.8, h: 0.3,
    fontSize: 9, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

slide9.addText("資料來源：10-page-hackathon-presentation-outline.md (Line 1014-1131) | 科學園區從業人數：科技部統計（2025）", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.2,
    fontSize: 9, color: COLORS.white,
    fontFace: "Arial"
});

slide9.addText("9 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.white,
    align: "right", fontFace: "Arial"
});

// ==================== 第10頁：行動呼籲（改進：添加聯絡方式） ====================
console.log("✓ 創建第10頁：行動呼籲");
let slide10 = pres.addSlide();
slide10.background = { color: COLORS.accent };

slide10.addText("給評審的三個理由：為什麼選擇我們？", {
    x: 0.5, y: 0.35, w: 9.0, h: 0.5,
    fontSize: 26, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});

// 三個理由
const reasons = [
    {
        number: "1",
        title: "時機就是現在 🔥",
        items: [
            "標案10/30開標，設計階段黃金窗口",
            "財劃法修正後，新竹市預算+210億",
            "長照3.0、托育新法政策到位",
            "新竹縣社福館成功經驗可複製"
        ],
        x: 0.5,
        y: 1.05
    },
    {
        number: "2",
        title: "財務與技術雙重可行 💰",
        items: [
            "2.3億預算，資金來源穩定",
            "月淨收入+51.9萬，年盈餘623萬",
            "SROI 1:2.04，社會價值量化",
            "CDC 2025標準，技術規格明確"
        ],
        x: 3.5,
        y: 1.05
    },
    {
        number: "3",
        title: "影響力可擴展 🌍",
        items: [
            "直接服務1,000家庭，節省73萬小時",
            "潛在複製7處，服務10萬家庭",
            "推動台灣版「共生型服務」立法",
            "創造15億元社會價值，國際輸出"
        ],
        x: 6.5,
        y: 1.05
    }
];

reasons.forEach(reason => {
    slide10.addShape(pres.ShapeType.rect, {
        x: reason.x, y: reason.y, w: 2.8, h: 1.65,
        fill: { color: COLORS.white, transparency: 5 },
        line: { type: "none" }
    });

    // 數字圓圈
    slide10.addShape(pres.ShapeType.ellipse, {
        x: reason.x + 1.05, y: reason.y + 0.12, w: 0.7, h: 0.7,
        fill: { color: COLORS.accent }
    });
    slide10.addText(reason.number, {
        x: reason.x + 1.05, y: reason.y + 0.12, w: 0.7, h: 0.7,
        fontSize: 30, bold: true, color: COLORS.white,
        align: "center", valign: "middle", fontFace: "Arial"
    });

    slide10.addText(reason.title, {
        x: reason.x, y: reason.y + 0.87, w: 2.8, h: 0.22,
        fontSize: 13, bold: true, color: COLORS.primary,
        align: "center", fontFace: "Arial"
    });

    let itemsText = reason.items.map(item => "• " + item).join("\n");
    slide10.addText(itemsText, {
        x: reason.x + 0.15, y: reason.y + 1.14, w: 2.5, h: 0.5,
        fontSize: 8, color: COLORS.black,
        fontFace: "Arial"
    });
});

// CTA框
slide10.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 2.85, w: 9.0, h: 1.35,
    fill: { color: COLORS.white, transparency: 5 },
    line: { color: COLORS.gold, width: 4 }
});
slide10.addText("今天的提案，明天的政策，後天的全台典範", {
    x: 0.6, y: 2.98, w: 8.8, h: 0.28,
    fontSize: 19, bold: true, color: COLORS.warning,
    align: "center", fontFace: "Arial"
});
slide10.addText("不是等政府做，而是政府已經在做", {
    x: 0.6, y: 3.35, w: 8.8, h: 0.22,
    fontSize: 15, color: COLORS.black,
    align: "center", fontFace: "Arial"
});
slide10.addText("我們只是讓它做得更好", {
    x: 0.6, y: 3.62, w: 8.8, h: 0.22,
    fontSize: 15, color: COLORS.black,
    align: "center", fontFace: "Arial"
});
slide10.addText("我們準備好了，新竹也準備好了。", {
    x: 0.6, y: 3.89, w: 8.8, h: 0.26,
    fontSize: 17, bold: true, color: COLORS.primary,
    align: "center", fontFace: "Arial"
});

// 底部資訊（改進：添加聯絡方式佔位符）
slide10.addShape(pres.ShapeType.rect, {
    x: 0, y: 4.4, w: 10, h: 1.15,
    fill: { color: COLORS.white, transparency: 10 }
});
slide10.addText("報告人：蔡秀吉", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.22,
    fontSize: 16, bold: true, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide10.addText("赤土崎全齡社福樞紐 — 解決竹科家庭「時間貧窮」的整合方案", {
    x: 0.5, y: 4.82, w: 9.0, h: 0.2,
    fontSize: 13, color: COLORS.white,
    align: "center", fontFace: "Arial"
});
slide10.addText("聯絡方式：[請填入電話] | [請填入Email] | 詳細資料與Q&A準備完整", {
    x: 0.5, y: 5.08, w: 9.0, h: 0.18,
    fontSize: 11, color: COLORS.gold, bold: true,
    align: "center", fontFace: "Arial"
});

slide10.addText("10 / 10", {
    x: 9.0, y: 5.3, w: 0.8, h: 0.2,
    fontSize: 12, bold: true, color: COLORS.white,
    align: "right", fontFace: "Arial"
});

// ==================== 保存簡報 ====================
const outputFile = "赤土崎全齡社福樞紐-蔡秀吉-最終版.pptx";
pres.writeFile({ fileName: outputFile })
    .then(() => {
        console.log(`\n✅ PowerPoint 簡報已成功生成（最終優化版）！`);
        console.log(`📄 檔案名稱：${outputFile}`);
        console.log(`📍 檔案位置：presentation/${outputFile}`);
        console.log(`\n📋 簡報資訊：`);
        console.log(`   - 總頁數：10頁`);
        console.log(`   - 報告人：蔡秀吉`);
        console.log(`   - 版面：16:9（720pt × 405pt）`);
        console.log(`   - 完成度：所有10頁完整內容 + 所有改進項目`);
        console.log(`\n✨ 改進項目（已整合）：`);
        console.log(`   ✓ 第1頁：添加圖片佔位符提示`);
        console.log(`   ✓ 第2頁：倉鼠emoji + 動線總計強化`);
        console.log(`   ✓ 第3頁：一站式動線說明框（改進項）`);
        console.log(`   ✓ 第4頁：技術術語白話化（STC 65 = 隔壁大哭聽不見）`);
        console.log(`   ✓ 第5頁：10/30開標緊迫感強化（本週三！）`);
        console.log(`   ✓ 第6頁：財務風險應對說明（80%收托率即可收支平衡）`);
        console.log(`   ✓ 第7頁：成本節省來源說明（共用空間、整合團隊）`);
        console.log(`   ✓ 第8頁：新竹縣見習快速上手`);
        console.log(`   ✓ 第9頁：擴展條件說明（SOP + 補助計畫）`);
        console.log(`   ✓ 第10頁：聯絡方式佔位符 + Q&A準備提示`);
        console.log(`   ✓ 全局：統一頁碼和資料來源字體`);
        console.log(`\n🎯 這個版本已整合所有批判性分析改進建議！`);
        console.log(`\n📌 後續建議：`);
        console.log(`   1. 替換第1頁圖片佔位符為實際竹科夜景照片`);
        console.log(`   2. 第10頁填入提案人聯絡方式`);
        console.log(`   3. 演練3次以上，確保8分鐘內完成`);
        console.log(`\n🏆 祝您奪冠！`);
    })
    .catch(err => {
        console.error("❌ 生成失敗：", err);
    });
