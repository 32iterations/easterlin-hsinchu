/**
 * HTML to PowerPoint 轉換腳本
 *
 * 使用方法：
 * 1. npm install pptxgenjs
 * 2. node convert-to-pptx.js
 *
 * 輸出：hackathon-presentation.pptx
 */

const PptxGenJS = require("pptxgenjs");
const fs = require('fs');
const path = require('path');

// 創建簡報對象
let pres = new PptxGenJS();

// 設置簡報屬性
pres.layout = "LAYOUT_16x9";
pres.author = "蔡秀吉";
pres.title = "赤土崎全齡社福樞紐";
pres.subject = "114年新竹政策黑客松提案";
pres.company = "赤土崎全齡社福樞紐專案團隊";

console.log("📊 開始創建 PowerPoint 簡報...\n");

// HTML 檔案列表
const slideFiles = [
    "slide-01-opening.html",
    "slide-02-painpoints.html",
    "slide-03-solution.html",
    "slide-04-innovation.html",
    "slide-05-policy.html",
    "slide-06-financial.html",
    "slide-07-benchmark.html",
    "slide-08-implementation.html",
    "slide-09-impact.html",
    "slide-10-cta.html"
];

console.log("⚠️  重要提示：");
console.log("由於 html2pptx 需要特定的HTML結構和額外的依賴，");
console.log("本腳本提供基礎框架。建議使用以下兩種方法之一：\n");
console.log("方法1：手動製作（推薦用於黑客松）");
console.log("  - 用瀏覽器打開每個HTML檔案");
console.log("  - 截圖並貼到PowerPoint");
console.log("  - 手動輸入文字內容\n");
console.log("方法2：使用線上轉換工具");
console.log("  - CloudConvert: https://cloudconvert.com/html-to-pptx");
console.log("  - 上傳HTML檔案");
console.log("  - 下載轉換後的PPTX\n");
console.log("方法3：使用 reveal.js（互動式簡報）");
console.log("  - 打開 index.html");
console.log("  - 按F鍵全螢幕播放");
console.log("  - 可匯出PDF（瀏覽器列印功能）\n");

// 創建基礎幻燈片結構（示範）
console.log("正在創建基礎幻燈片結構...\n");

// 第1頁：開場
let slide1 = pres.addSlide();
slide1.background = { color: "0066CC" };
slide1.addText("「為什麼媽媽你今天不用在公司？」", {
    x: 0.5,
    y: 1.0,
    w: 9.0,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: "FFFFFF",
    align: "center",
    valign: "middle"
});

slide1.addText([
    { text: "100%", options: { fontSize: 32, bold: true, color: "FFD700" } },
    { text: " 工作-家庭失衡困境\n", options: { fontSize: 18, color: "FFFFFF" } },
    { text: "54.5%", options: { fontSize: 32, bold: true, color: "FFD700" } },
    { text: " 時間貧窮痛點\n", options: { fontSize: 18, color: "FFFFFF" } },
    { text: "36.4%", options: { fontSize: 32, bold: true, color: "FFD700" } },
    { text: " 家庭關係危機", options: { fontSize: 18, color: "FFFFFF" } }
], {
    x: 1.0,
    y: 3.0,
    w: 8.0,
    h: 2.0,
    align: "center"
});

slide1.addText("報告人：蔡秀吉 | 資料來源：11篇竹科家庭質性研究分析", {
    x: 0.5,
    y: 5.2,
    w: 9.0,
    h: 0.3,
    fontSize: 10,
    color: "FFFFFF",
    align: "center"
});

slide1.addText("1 / 10", {
    x: 9.0,
    y: 5.3,
    w: 0.8,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: "FFFFFF",
    align: "right"
});

console.log("✓ 第1頁已創建");

// 第2-10頁：提示訊息
for (let i = 2; i <= 10; i++) {
    let slide = pres.addSlide();
    slide.addText(`第${i}頁內容`, {
        x: 1.0,
        y: 1.5,
        w: 8.0,
        h: 1.0,
        fontSize: 32,
        bold: true,
        color: "333333",
        align: "center"
    });

    slide.addText([
        { text: "請參考 ", options: { fontSize: 16, color: "666666" } },
        { text: `slide-${String(i).padStart(2, '0')}-*.html`, options: { fontSize: 16, bold: true, color: "0066CC" } },
        { text: " 手動製作此頁", options: { fontSize: 16, color: "666666" } }
    ], {
        x: 1.0,
        y: 2.8,
        w: 8.0,
        h: 0.5,
        align: "center"
    });

    slide.addText(`${i} / 10`, {
        x: 9.0,
        y: 5.3,
        w: 0.8,
        h: 0.3,
        fontSize: 12,
        bold: true,
        color: "666666",
        align: "right"
    });

    console.log(`✓ 第${i}頁框架已創建`);
}

// 保存簡報
const outputFile = "hackathon-presentation.pptx";
pres.writeFile({ fileName: outputFile })
    .then(() => {
        console.log(`\n✅ 簡報已保存：${outputFile}`);
        console.log("\n📝 下一步：");
        console.log("1. 打開 hackathon-presentation.pptx");
        console.log("2. 參考各HTML檔案，手動完成第2-10頁");
        console.log("3. 或使用 reveal.js 互動式簡報（index.html）\n");
        console.log("🎯 提示：手動製作約需1-2小時，但可完全掌控版面細節");
        console.log("🚀 祝您奪冠！");
    })
    .catch(err => {
        console.error("❌ 錯誤：", err);
    });
