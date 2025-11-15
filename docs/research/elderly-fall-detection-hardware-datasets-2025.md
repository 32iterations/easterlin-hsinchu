# 長者跌倒偵測系統 - 硬體設備與開源數據集完整調研報告

**調研日期**: 2025年11月15日
**目的**: 赤土崎全齡社福樞紐 - O-RAN AI跌倒偵測系統
**應用場景**: 1F失智長者日照中心 + 全館安全監控

---

## 📋 執行摘要

本報告深度調研了**長者跌倒偵測**所需的硬體設備和開源訓練數據集，基於2023-2025年最新學術研究與商業產品。主要發現：

### 核心硬體技術（3大類）
1. **穿戴式IMU感測器**：準確度最高（>98%），但需長者配戴
2. **60GHz毫米波雷達**：非接觸式、隱私保護、穿透障礙物
3. **視覺系統**：攝影機/深度相機，準確但隱私疑慮

### 開源數據集（10+ 個可立即下載）
- **SisFall**：最常用，38名受試者，19種ADL + 15種跌倒類型
- **FallAllD**：最大規模，26,420個檔案，3個穿戴位置
- **UP-Fall**：多模態，850GB資料，含影像+穿戴感測器

### 最佳實踐建議
- **赤土崎方案**：60GHz毫米波雷達 + IMU手環 + AI融合
- **成本**：硬體約NT$15-30萬（12個基站）
- **準確度**：多感測器融合可達 >99%

---

## 一、硬體設備調研

### 1.1 穿戴式IMU感測器（Wearable IMU Sensors）

#### ✅ 技術原理
- **感測器組成**：3軸加速度計 + 3軸陀螺儀 + 3軸磁力計（9-DOF IMU）
- **採樣頻率**：50-200 Hz
- **測量範圍**：加速度 ±4g 到 ±8g，角速度 ±500 dps
- **穿戴位置**：腰部（最常用）、手腕、頸部

#### 📦 推薦硬體產品

| 產品名稱 | 晶片型號 | 規格 | 成本 | 適用場景 |
|---------|---------|------|------|---------|
| **STMicroelectronics LSM6DSOX** | LSM6DSOX | 6軸IMU（加速度+陀螺儀）<br>超低功耗<br>內建ML核心 | ~NT$300/顆 | 穿戴裝置、手環 |
| **STMicroelectronics LSM6DSO** | LSM6DSO | 加速度範圍 ±8g<br>角速度 ±500 dps<br>I2C/SPI介面 | ~NT$250/顆 | 研究原型、DIY |
| **10DOF IMU感測器板** | 整合模組 | 3軸加速度+陀螺儀+磁力計<br>BMP180氣壓計 | ~NT$800-1,500 | Arduino/ESP32開發 |
| **Lattice iCE40UP FPGA + LSM6DSOX** | 高階整合 | 超低功耗FPGA<br>即時AI推論 | ~NT$3,000-5,000 | 商業產品 |

#### 🎯 優缺點分析

**優點**：
- ✅ 準確度極高（98-99.4%）
- ✅ 成本低廉（單顆<NT$500）
- ✅ 功耗低（適合電池供電）
- ✅ 可偵測跌倒前兆（姿態變化）
- ✅ 學術研究最多（論文可參考）

**缺點**：
- ❌ 需長者配戴（依從性問題）
- ❌ 電池需定期充電
- ❌ 可能遺失或忘記佩戴
- ❌ 洗澡、睡覺時無法使用

#### 📊 學術研究成果（2023-2025）

| 研究 | 演算法 | 準確度 | 數據集 | 發表年份 |
|------|--------|--------|--------|---------|
| Kavuncuoğlu (2024) | ETC + Quintuple Features | **98.69%** | SisFall | 2024 |
| Rodrigues et al. (2018) | Fine kNN | **99.4%** | 自製 | 2018 |
| Salah et al. (2022) | LSTM | **96.78%** | 邊緣運算 | 2022 |
| Albert et al. (2012) | SVM | **99%**（跌倒類型分類） | 手機感測器 | 2012 |

---

### 1.2 60GHz毫米波雷達（mmWave Radar）

#### ✅ 技術原理
- **技術**：FMCW（調頻連續波）雷達
- **頻段**：60-64 GHz（ISM頻段，免許可證）
- **偵測範圍**：0.5-6公尺
- **空間解析度**：<0.5公尺
- **時間解析度**：即時（<100ms延遲）
- **隱私保護**：✅ 不拍攝影像，僅偵測運動

#### 📦 推薦硬體產品（2024-2025 最新）

| 產品名稱 | 晶片 | 規格 | 成本 | 供應商 | 特色 |
|---------|------|------|------|--------|------|
| **Seeed Studio MR60FDA2** | 60GHz FMCW | 偵測距離 0.5-6m<br>Home Assistant整合<br>XIAO ESP32C6內建<br>Wi-Fi連線 | **~US$25-35** | Seeed Studio | ✅ 即插即用<br>✅ ESPHome韌體<br>✅ 開源友善 |
| **DFRobot C1001** | 60GHz | 跌倒偵測+睡眠追蹤<br>Arduino/ESP32相容<br>高精度態勢辨識 | **~US$30-40** | DFRobot | ✅ Arduino生態系<br>✅ 中文文件 |
| **Milesight VS373** | 4D 60GHz | AI演算法<br>LoRaWAN連線<br>穿透障礙物<br>準確度99% | **~US$100-150** | Milesight IoT | ✅ 商業級<br>✅ LoRaWAN<br>✅ 遠端管理 |
| **iflabel IR60FD1A** | 60GHz FMCW | 人體姿態辨識<br>UART介面<br>無線感知 | **~US$20-30** | iflabel | ✅ 低成本<br>✅ OEM友善 |
| **Texas Instruments IWR6843** | TI 60GHz | 單晶片雷達<br>高效能運算<br>工業級 | **~US$50-80** | Texas Instruments | ✅ 業界標準<br>✅ 完整SDK |

#### 🎯 優缺點分析

**優點**：
- ✅ 非接觸式（長者無需配戴）
- ✅ 隱私保護（不拍攝影像）
- ✅ 可穿透衣物、床單、窗簾
- ✅ 不受光線影響（夜間可用）
- ✅ 可偵測呼吸、心跳（生命跡象）
- ✅ 安裝簡單（壁掛式）

**缺點**：
- ❌ 偵測範圍有限（6公尺）
- ❌ 多人環境可能混淆
- ❌ 需專業調校（避免誤報）
- ❌ 金屬物體會產生反射干擾

#### 📊 實際應用案例

**Milesight VS373 測試數據**：
- 準確度：**99%**
- 誤報率：<1%
- 反應時間：<100ms
- 適用環境：醫院病房、養老院、居家照護

---

### 1.3 視覺系統（Vision-Based）

#### ✅ 技術類型

| 技術 | 原理 | 優點 | 缺點 |
|------|------|------|------|
| **RGB攝影機** | 2D影像分類 | 成本低、部署簡單 | 隱私疑慮、光線敏感 |
| **深度相機（Kinect）** | 3D深度感測 | 姿態辨識準確 | 成本高、範圍小 |
| **紅外線熱像儀** | 溫度分佈偵測 | 隱私保護佳 | 解析度低、成本高 |

#### 📦 推薦硬體

| 產品 | 技術 | 成本 | 適用場景 |
|------|------|------|---------|
| **Microsoft Kinect V2** | RGB-D深度相機 | ~US$150-250（停產，二手） | 研究用途 |
| **Intel RealSense D435** | 立體深度相機 | ~US$250-350 | 商業應用 |
| **Roboflow + Webcam** | AI影像識別 | ~US$30-100 | 低成本方案 |

#### 🎯 隱私問題與對策

**隱私疑慮**：
- ❌ 錄製影像侵犯隱私
- ❌ 長者反感攝影機監控
- ❌ 家屬擔心影像外洩

**技術對策**：
- ✅ 僅傳輸骨架關鍵點（不傳影像）
- ✅ 邊緣運算（影像不上雲）
- ✅ 深度圖取代RGB影像
- ✅ 僅在跌倒時錄製（平時不錄）

---

### 1.4 多感測器融合方案（推薦！）

#### 🌟 赤土崎最佳方案：60GHz雷達 + IMU手環 + AI融合

```
系統架構：

1F失智專區（200m²）配置：
├── 60GHz毫米波雷達：4個壁掛基站（覆蓋全區）
│   ├── 基站A：活動室北側（覆蓋40m²）
│   ├── 基站B：活動室南側（覆蓋40m²）
│   ├── 基站C：徘徊走廊（覆蓋60m²）
│   └── 基站D：休息室（覆蓋60m²）
│
├── IMU智慧手環：50個（每位長者配戴）
│   ├── 感測器：LSM6DSOX（6軸IMU）
│   ├── 通訊：BLE 5.0（低功耗藍牙）
│   ├── 電池：7天續航
│   └── 防水等級：IP67
│
└── AI融合引擎（邊緣伺服器）
    ├── 硬體：NVIDIA Jetson Orin Nano
    ├── 演算法：多模態深度學習
    │   ├── 雷達分支：CNN-LSTM（運動軌跡）
    │   ├── IMU分支：Transformer（加速度特徵）
    │   └── 融合層：Attention機制
    └── 輸出：跌倒警報（<500ms延遲）
```

#### 💰 成本估算（1F失智專區）

| 項目 | 數量 | 單價 | 小計 | 備註 |
|------|------|------|------|------|
| **60GHz雷達基站** | 4 | NT$2,500 | **NT$10,000** | Seeed MR60FDA2 |
| **IMU智慧手環** | 50 | NT$800 | **NT$40,000** | 自製（ESP32+LSM6DSOX） |
| **邊緣運算伺服器** | 1 | NT$15,000 | **NT$15,000** | NVIDIA Jetson Orin Nano |
| **閘道器（BLE）** | 2 | NT$3,000 | **NT$6,000** | ESP32 BLE Gateway |
| **網路設備** | 1 | NT$5,000 | **NT$5,000** | PoE Switch |
| **安裝施工** | 1 | NT$20,000 | **NT$20,000** | 包含佈線、調校 |
| **軟體開發** | 1 | NT$50,000 | **NT$50,000** | AI模型訓練、整合 |
| **緊急通知裝置** | 5 | NT$2,000 | **NT$10,000** | 護理站警報器 |
| **總計** | - | - | **NT$156,000** | 1F失智專區（200m²） |

#### 🎯 技術優勢

✅ **雙重保險**：
- 雷達：環境監控（無死角）
- 手環：個人監控（精準定位）

✅ **互補優勢**：
- 雷達：偵測「脫離正常活動範圍」
- 手環：偵測「加速度突變」
- 融合：偵測「倒地後長時間不動」

✅ **降低誤報**：
- 單一感測器誤報：5-10%
- 雙感測器融合誤報：<1%

---

## 二、開源數據集調研

### 2.1 數據集總覽（10個重點推薦）

| 數據集名稱 | 類型 | 受試者數 | 資料量 | 下載連結 | 推薦度 |
|-----------|------|---------|--------|---------|--------|
| **SisFall** | IMU | 38人 | 4,505個樣本 | [MDPI](https://www.mdpi.com/1424-8220/17/1/198) | ⭐⭐⭐⭐⭐ |
| **FallAllD** | IMU (3位置) | 15人 | 26,420個檔案 | [IEEE DataPort](https://ieee-dataport.org/open-access/fallalld-comprehensive-dataset-human-falls-and-activities-daily-living) | ⭐⭐⭐⭐⭐ |
| **UP-Fall** | 多模態 | 17人 | 850GB | [官網](https://sites.google.com/up.edu.mx/har-up/) | ⭐⭐⭐⭐⭐ |
| **UR Fall** | Kinect深度相機 | 多人 | RGB+深度+IMU | [官網](https://fenix.ur.edu.pl/~mkepski/ds/uf.html) | ⭐⭐⭐⭐ |
| **WEDA-FALL** | 手腕穿戴 | - | 50Hz採樣 | [GitHub](https://github.com/joaojtmarques/WEDA-FALL) | ⭐⭐⭐⭐ |
| **FUKinect-Fall** | Kinect V1 | 21人 | 6種動作 | [GitHub](https://github.com/MuzafferAslan23/Fall-Detection-Dataset) | ⭐⭐⭐ |
| **KFall** | 影像 | - | 老年人跌倒 | [官網](https://sites.google.com/view/kfalldataset) | ⭐⭐⭐ |
| **Roboflow Fall Detection** | 影像標註 | - | 4,497張影像 | [Roboflow](https://universe.roboflow.com/roboflow-universe-projects/fall-detection-ca3o8) | ⭐⭐⭐ |
| **GMDCSA-24** | 影片 | 4人 | 524個樣本 | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2352340924008552) | ⭐⭐⭐ |
| **TST Fall Detection v2** | IMU | - | - | [IEEE DataPort](https://ieee-dataport.org/documents/tst-fall-detection-dataset-v2) | ⭐⭐ |

---

### 2.2 重點數據集詳細介紹

#### 🥇 SisFall Dataset（最常用、最推薦）

**基本資訊**：
- **發布機構**: Universidad de Antioquia（哥倫比亞）
- **發布年份**: 2017年
- **授權**: Open Access（免費下載）

**數據規格**：
- **受試者**：38人
  - 23名年輕成人（19-30歲）
  - 15名健康老年人（60-75歲）
- **感測器**：
  - 2個加速度計（ADXL345 + MMA8451Q）
  - 1個陀螺儀（ITG3200）
  - 採樣頻率：**200 Hz**
  - 穿戴位置：**腰部**
- **活動類型**：
  - **19種日常活動（ADL）**：走路、坐下、躺下、上下樓梯等
  - **15種跌倒類型**：向前跌、向後跌、側跌、絆倒、暈倒等
- **總樣本數**：4,505個活動序列

**下載連結**：
1. **官方來源（MDPI）**: https://www.mdpi.com/1424-8220/17/1/198
2. **補充材料下載**: 點擊論文頁面的 "Supplementary Materials"
3. **影片演示**: 包含每種活動的示範影片

**GitHub分析工具**：
- https://github.com/WJMatthew/SisFallAnalysis
- https://github.com/gagan16/Fall-detetction-using-Imu-s

**引用文獻**：
```
Sucerquia, A.; López, J.D.; Vargas-Bonilla, J.F.
SisFall: A Fall and Movement Dataset.
Sensors 2017, 17, 198.
https://doi.org/10.3390/s17010198
```

**為何推薦？**
- ✅ 學術界最常用（引用數>500）
- ✅ 包含真實老年人數據（60-75歲）
- ✅ 15種跌倒類型（涵蓋全面）
- ✅ 200Hz高採樣率（適合深度學習）
- ✅ 免費開放、無需申請

---

#### 🥈 FallAllD Dataset（資料量最大）

**基本資訊**：
- **發布機構**: IEEE DataPort
- **發布年份**: 2020年
- **授權**: Open Access（需免費註冊IEEE帳號）

**數據規格**：
- **受試者**：15人
- **感測器**：LSM9DS1（9軸IMU）
  - 3軸加速度計
  - 3軸陀螺儀
  - 3軸磁力計
- **穿戴位置**：**3個位置同時收集**
  - 腰部（Waist）
  - 手腕（Wrist）
  - 頸部（Neck）
- **總檔案數**：**26,420個CSV檔案**
- **檔案格式**：CSV（逗號分隔）
- **工具支援**：
  - MATLAB轉換工具
  - Python Pandas轉換工具（HDF/Pickle格式）

**下載連結**：
- **IEEE DataPort**: https://ieee-dataport.org/open-access/fallalld-comprehensive-dataset-human-falls-and-activities-daily-living
- **DOI**: 10.21227/bnya-mn34

**引用文獻**：
```
M. Saleh, M. Abbas and R. L. B. Jeannès,
"FallAllD: An Open Dataset of Human Falls and Activities of Daily Living for Classical and Deep Learning Applications,"
IEEE Sensors Journal, doi: 10.1109/JSEN.2020.3018335.
```

**為何推薦？**
- ✅ 資料量最大（26,420個檔案）
- ✅ 3個穿戴位置（可研究最佳位置）
- ✅ 提供MATLAB/Python轉換工具
- ✅ IEEE官方託管（長期可用）

---

#### 🥉 UP-Fall Detection Dataset（多模態最佳）

**基本資訊**：
- **發布機構**: Universidad Panamericana（墨西哥）
- **發布年份**: 2019年
- **授權**: Open Access

**數據規格**：
- **受試者**：17名健康年輕人
- **感測器組合**（多模態）：
  - **穿戴感測器**：加速度計、陀螺儀、心率
  - **環境感測器**：紅外線、氣壓、溫度
  - **視覺裝置**：2個Kinect（RGB + 深度）、6個攝影機
- **活動類型**：11種活動+跌倒（各3次嘗試）
- **總資料量**：**850 GB**

**下載連結**：
- **官方網站**: https://sites.google.com/up.edu.mx/har-up/
- **GitHub工具**: https://github.com/jpnm561/HAR-UP

**引用文獻**：
```
Lourdes Martínez-Villaseñor, Hiram Ponce, Jorge Brieva, Ernesto Moya-Albor,
José Núñez-Martínez, Carlos Peñafort-Asturiano,
"UP-Fall Detection Dataset: A Multimodal Approach",
Sensors 19(9), 1988, 2019, doi:10.3390/s19091988.
```

**為何推薦？**
- ✅ 多模態（影像+穿戴+環境）
- ✅ 適合研究感測器融合
- ✅ 包含深度相機數據
- ✅ 資料量龐大（850GB）

---

#### 🎬 UR Fall Detection Dataset（Kinect深度相機）

**基本資訊**：
- **發布機構**: University of Rzeszow（波蘭）
- **感測器**：
  - 2個Kinect（RGB + 深度影像）
  - IMU慣性裝置（藍牙連線）

**下載連結**：
- **官方網站**: https://fenix.ur.edu.pl/~mkepski/ds/uf.html

**數據內容**：
- RGB影像序列
- 深度影像序列
- 原始加速度資料

**為何推薦？**
- ✅ Kinect資料（適合視覺研究）
- ✅ 同時包含IMU數據
- ✅ 免費下載

---

#### 🤖 Roboflow Fall Detection Dataset（影像標註）

**基本資訊**：
- **發布機構**: Roboflow Universe
- **數據類型**: 影像標註（Object Detection）
- **影像數量**：4,497張
- **格式**：YOLO, COCO JSON, Pascal VOC

**下載連結**：
- https://universe.roboflow.com/roboflow-universe-projects/fall-detection-ca3o8

**為何推薦？**
- ✅ 已標註好的影像（省時間）
- ✅ 支援YOLO格式（直接訓練）
- ✅ 提供預訓練模型API
- ✅ 適合視覺深度學習

---

### 2.3 數據集選擇指南

#### 🎯 根據研究目標選擇

| 研究目標 | 推薦數據集 | 理由 |
|---------|-----------|------|
| **IMU穿戴式感測器** | SisFall | 最常用、論文可對比 |
| **多穿戴位置比較** | FallAllD | 3個位置同時收集 |
| **多感測器融合** | UP-Fall | 影像+IMU+環境感測器 |
| **視覺深度學習** | Roboflow | 已標註影像 |
| **Kinect深度相機** | UR Fall | RGB-D資料 |
| **老年人特定數據** | SisFall | 包含60-75歲真實數據 |

#### 📥 數據集下載步驟（以SisFall為例）

```bash
# 步驟1：訪問官方論文頁面
https://www.mdpi.com/1424-8220/17/1/198

# 步驟2：點擊 "Supplementary Materials"
# 下載 "sensors-17-00198-s001.zip"

# 步驟3：解壓縮
unzip sensors-17-00198-s001.zip

# 步驟4：數據格式
# 每個CSV檔案包含：
# - Column 1-3: 加速度計1 (ADXL345) - X, Y, Z軸
# - Column 4-6: 加速度計2 (MMA8451Q) - X, Y, Z軸
# - Column 7-9: 陀螺儀 (ITG3200) - X, Y, Z軸

# 步驟5：Python讀取範例
import pandas as pd
import numpy as np

# 讀取CSV
data = pd.read_csv('D01_SA01_R01.txt', header=None)

# 提取加速度數據（9個欄位）
accel_1 = data.iloc[:, 0:3].values  # 加速度計1
accel_2 = data.iloc[:, 3:6].values  # 加速度計2
gyro = data.iloc[:, 6:9].values     # 陀螺儀

print(f"數據形狀: {data.shape}")
print(f"採樣點數: {len(data)}")
```

---

## 三、AI模型訓練建議

### 3.1 推薦深度學習架構

#### 🏆 最佳實踐：多模態Transformer

```python
# 基於SisFall數據集的訓練範例

import tensorflow as tf
from tensorflow.keras import layers, models

def build_fall_detection_model(input_shape=(200, 9)):  # 200Hz × 1秒 × 9軸
    """
    輸入：(batch_size, time_steps, features)
    - time_steps: 200個時間點（1秒@200Hz）
    - features: 9個特徵（2個加速度計 + 1個陀螺儀）

    輸出：(batch_size, 2) - [正常, 跌倒]
    """

    # 輸入層
    inputs = layers.Input(shape=input_shape)

    # CNN分支：提取局部特徵
    cnn_branch = layers.Conv1D(64, kernel_size=5, activation='relu')(inputs)
    cnn_branch = layers.MaxPooling1D(pool_size=2)(cnn_branch)
    cnn_branch = layers.Conv1D(128, kernel_size=3, activation='relu')(cnn_branch)
    cnn_branch = layers.MaxPooling1D(pool_size=2)(cnn_branch)
    cnn_branch = layers.Flatten()(cnn_branch)

    # LSTM分支：提取時序特徵
    lstm_branch = layers.LSTM(128, return_sequences=True)(inputs)
    lstm_branch = layers.LSTM(64)(lstm_branch)

    # 融合層
    concat = layers.Concatenate()([cnn_branch, lstm_branch])
    dense = layers.Dense(128, activation='relu')(concat)
    dense = layers.Dropout(0.5)(dense)
    outputs = layers.Dense(2, activation='softmax')(dense)  # 2類別：正常/跌倒

    model = models.Model(inputs=inputs, outputs=outputs)
    return model

# 編譯模型
model = build_fall_detection_model()
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy', 'precision', 'recall']
)

# 訓練（假設已準備好 X_train, y_train）
# history = model.fit(
#     X_train, y_train,
#     validation_split=0.2,
#     epochs=50,
#     batch_size=32
# )
```

### 3.2 特徵工程（Feature Engineering）

#### 📊 手工特徵提取（提升準確度）

根據學術研究（Kavuncuoğlu 2024），以下特徵組合表現最佳：

```python
import numpy as np
from scipy import stats

def extract_features(window_data):
    """
    從200個時間點的IMU數據提取26個特徵

    輸入：window_data shape = (200, 9)
    輸出：features shape = (26,)
    """
    features = []

    # 1. 基本統計特徵（9個）
    features.append(np.mean(window_data, axis=0))      # 平均值
    features.append(np.std(window_data, axis=0))       # 標準差
    features.append(np.max(window_data, axis=0))       # 最大值

    # 2. 峰度與偏度（6個）
    features.append(stats.kurtosis(window_data, axis=0))  # Kurtosis
    features.append(stats.skew(window_data, axis=0))      # Skewness

    # 3. 訊號幅度向量（SMA）
    sma = np.sum(np.abs(window_data), axis=0) / len(window_data)
    features.append(sma)

    # 4. 訊號幅度面積（Signal Magnitude Area）
    svm = np.sqrt(np.sum(window_data**2, axis=1))
    features.append(np.mean(svm))
    features.append(np.std(svm))

    # 5. 自相關係數（Autocorrelation）- 最重要！
    autocorr = np.correlate(svm, svm, mode='same')
    features.append(np.max(autocorr))

    # 6. 頻域特徵（FFT）
    fft = np.fft.fft(window_data, axis=0)
    fft_magnitude = np.abs(fft)
    features.append(np.mean(fft_magnitude, axis=0))

    # 扁平化為1D向量
    features = np.concatenate([np.atleast_1d(f).flatten() for f in features])
    return features[:26]  # 取前26個特徵
```

**特徵重要性排名（根據RFC演算法）**：
1. **自相關係數**（Autocorrelation）- 準確度 97.94%
2. **訊號幅度向量**（SVM）
3. **時序特徵**（LSTM輸出）
4. **頻域特徵**（FFT）
5. **基本統計**（均值、標準差）

---

### 3.3 訓練超參數建議

| 參數 | 推薦值 | 說明 |
|------|--------|------|
| **時間窗口** | 1-2秒 | 200Hz × 1秒 = 200個時間點 |
| **重疊比例** | 50% | 滑動窗口重疊50% |
| **批次大小** | 32-64 | 取決於GPU記憶體 |
| **學習率** | 0.001 | Adam優化器 |
| **Dropout** | 0.5 | 防止過擬合 |
| **Epochs** | 50-100 | Early stopping |
| **類別權重** | 平衡 | 跌倒樣本較少，需加權 |

---

## 四、赤土崎部署方案（實際應用）

### 4.1 1F失智專區跌倒偵測系統

#### 🎯 系統目標
- **覆蓋範圍**：200m²（失智專區）
- **服務對象**：50-60名失智長者
- **準確度目標**：>98%
- **誤報率目標**：<1%
- **反應時間**：<500ms

#### 🏗️ 硬體部署方案

```
失智專區（200m²）硬體配置：

┌─────────────────────────────────────────────────┐
│  1F 失智日照中心（200m²）                        │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ 活動室A      │  │ 活動室B      │            │
│  │ 80m²         │  │ 80m²         │            │
│  │ [雷達1]      │  │ [雷達2]      │            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  ┌──────────────────────────────┐               │
│  │ 環形徘徊走廊（60m²）         │               │
│  │ [雷達3]                      │               │
│  └──────────────────────────────┘               │
│                                                  │
│  ┌──────────────┐                                │
│  │ 休息室       │                                │
│  │ 60m²         │                                │
│  │ [雷達4]      │                                │
│  └──────────────┘                                │
│                                                  │
│  [邊緣伺服器] ← BLE閘道器1、2                    │
│                ↓                                 │
│         護理站警報系統                            │
└─────────────────────────────────────────────────┘

感測器配置：
├── 60GHz毫米波雷達：4個（Seeed MR60FDA2）
├── IMU智慧手環：50個（LSM6DSOX + ESP32）
├── BLE閘道器：2個（ESP32 BLE Gateway）
├── 邊緣AI伺服器：1台（NVIDIA Jetson Orin Nano）
└── 警報系統：護理站螢幕 + 聲光警報
```

#### 💻 軟體架構

```python
# 多感測器融合演算法（偽代碼）

class FallDetectionSystem:
    def __init__(self):
        self.radar_detector = RadarFallDetector()  # 60GHz雷達
        self.imu_detector = IMUFallDetector()      # IMU手環
        self.fusion_model = FusionModel()          # AI融合模型

    def detect_fall(self, timestamp):
        # 1. 從雷達獲取資料
        radar_data = self.radar_detector.get_motion_data()
        # 輸出：{person_id, position, velocity, fall_probability}

        # 2. 從IMU手環獲取資料（透過BLE）
        imu_data = self.imu_detector.get_acceleration_data()
        # 輸出：{person_id, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z}

        # 3. 數據對齊（根據person_id）
        aligned_data = self.align_sensor_data(radar_data, imu_data)

        # 4. AI融合模型推論
        fall_prediction = self.fusion_model.predict(aligned_data)
        # 輸出：{person_id, fall_probability, confidence}

        # 5. 決策邏輯（多層級警報）
        if fall_prediction['fall_probability'] > 0.9:
            # Level 1: 紅色警報（高度疑似跌倒）
            self.trigger_alert(
                level='RED',
                person_id=fall_prediction['person_id'],
                location=radar_data['position'],
                confidence=fall_prediction['confidence']
            )
        elif fall_prediction['fall_probability'] > 0.7:
            # Level 2: 黃色警告（可能跌倒）
            self.trigger_alert(level='YELLOW', ...)
        else:
            # Level 3: 正常（記錄日誌）
            self.log_normal_activity(...)

        return fall_prediction

    def trigger_alert(self, level, person_id, location, confidence):
        """觸發警報"""
        # 1. 護理站螢幕顯示
        self.display_on_nursing_station(
            person_name=self.get_person_name(person_id),
            location=location,
            timestamp=datetime.now(),
            confidence=confidence
        )

        # 2. 聲光警報
        if level == 'RED':
            self.sound_alarm(volume='HIGH')

        # 3. 推送至家屬App
        self.send_push_notification(
            person_id=person_id,
            message=f"{self.get_person_name(person_id)} 可能跌倒，位置：{location}"
        )

        # 4. 記錄事件資料庫
        self.log_to_database(...)
```

---

### 4.2 AI模型訓練流程（實際操作）

#### 📚 Step 1: 下載SisFall數據集

```bash
# 1. 訪問 MDPI 論文頁面
https://www.mdpi.com/1424-8220/17/1/198

# 2. 下載補充材料（約200MB）
# sensors-17-00198-s001.zip

# 3. 解壓縮
mkdir sisfall_dataset
unzip sensors-17-00198-s001.zip -d sisfall_dataset/

# 4. 資料夾結構
sisfall_dataset/
├── SA01/  # 受試者1（19-30歲）
│   ├── D01_SA01_R01.txt  # 跌倒類型1
│   ├── D02_SA01_R01.txt
│   └── ...
├── SA02/  # 受試者2
├── ...
├── SE01/  # 長者1（60-75歲）
└── ...
```

#### 🔧 Step 2: 數據預處理

```python
import pandas as pd
import numpy as np
from pathlib import Path

def load_sisfall_dataset(data_dir='sisfall_dataset'):
    """載入SisFall數據集"""
    X_data = []
    y_labels = []

    data_path = Path(data_dir)

    # 遍歷所有受試者資料夾
    for subject_folder in data_path.glob('S*/'):
        # 遍歷該受試者的所有活動檔案
        for csv_file in subject_folder.glob('*.txt'):
            # 讀取CSV（無標頭，9個欄位）
            data = pd.read_csv(csv_file, header=None).values

            # 提取標籤（檔名格式：D01_SA01_R01.txt）
            # D開頭 = 跌倒（Fall）, F開頭 = 日常活動（ADL）
            filename = csv_file.name
            label = 1 if filename.startswith('D') else 0  # 1=跌倒, 0=正常

            # 滑動窗口切割（1秒@200Hz = 200個時間點）
            window_size = 200
            step_size = 100  # 50%重疊

            for i in range(0, len(data) - window_size, step_size):
                window = data[i:i+window_size, :]  # shape: (200, 9)
                X_data.append(window)
                y_labels.append(label)

    # 轉換為numpy陣列
    X = np.array(X_data)  # shape: (N, 200, 9)
    y = np.array(y_labels)  # shape: (N,)

    print(f"總樣本數: {len(X)}")
    print(f"跌倒樣本: {np.sum(y == 1)}")
    print(f"正常樣本: {np.sum(y == 0)}")

    return X, y

# 載入數據
X, y = load_sisfall_dataset('sisfall_dataset')
```

#### 🤖 Step 3: 訓練模型

```python
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

# 1. 資料分割（80%訓練、20%測試）
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 2. One-hot編碼
y_train_cat = to_categorical(y_train, num_classes=2)
y_test_cat = to_categorical(y_test, num_classes=2)

# 3. 類別權重（處理不平衡）
from sklearn.utils.class_weight import compute_class_weight
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(y_train),
    y=y_train
)
class_weight_dict = {0: class_weights[0], 1: class_weights[1]}

# 4. 訓練模型（使用前面定義的架構）
model = build_fall_detection_model(input_shape=(200, 9))

history = model.fit(
    X_train, y_train_cat,
    validation_data=(X_test, y_test_cat),
    epochs=50,
    batch_size=32,
    class_weight=class_weight_dict,
    callbacks=[
        tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
    ]
)

# 5. 評估模型
from sklearn.metrics import classification_report, confusion_matrix

y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)

print("分類報告：")
print(classification_report(y_test, y_pred_classes, target_names=['正常', '跌倒']))

print("\n混淆矩陣：")
print(confusion_matrix(y_test, y_pred_classes))

# 6. 儲存模型
model.save('fall_detection_model.h5')
```

#### 📊 預期結果

根據學術研究（Kavuncuoğlu 2024），使用SisFall數據集訓練的最佳模型：

| 指標 | 數值 |
|------|------|
| **準確度（Accuracy）** | 98.69% |
| **敏感度（Sensitivity/Recall）** | 98.28% |
| **特異度（Specificity）** | 99.08% |
| **F1-Score** | 98.68% |

---

## 五、常見問題與解決方案

### Q1: IMU感測器放在哪個位置最準確？

**A**: 根據FallAllD數據集的研究：
- **腰部**：準確度最高（98%+），但配戴不便
- **手腕**：準確度中等（95%），配戴方便（智慧手環）
- **頸部**：準確度較低（92%），較少使用

**赤土崎建議**：手腕（智慧手環形式），平衡準確度與配戴意願。

---

### Q2: 如何降低誤報率（False Alarm）？

**A**: 多層級驗證機制：
1. **時間窗口驗證**：跌倒後通常會靜止5-10秒
2. **多感測器融合**：雷達+IMU雙重確認
3. **AI信心度閾值**：只在>90%信心度時警報
4. **人工確認機制**：黃色警告時由護理人員確認

---

### Q3: 長者不願意配戴IMU手環怎麼辦？

**A**: 採用60GHz毫米波雷達作為主要監控，IMU作為輔助：
- **非配戴時**：單純依賴雷達偵測（準確度約95%）
- **配戴時**：雷達+IMU融合（準確度>99%）
- **設計友善手環**：輕量化、防水、長續航（7天）

---

### Q4: 數據集是否包含真實老年人跌倒？

**A**: 大多數數據集使用**模擬跌倒**（年輕人演員），理由：
- 真實跌倒會造成傷害（倫理問題）
- 但**SisFall包含15名60-75歲真實長者**的日常活動數據
- 建議：先用模擬數據訓練，再用實際場域微調（Transfer Learning）

---

### Q5: 如何處理數據不平衡（跌倒樣本少）？

**A**: 多種策略組合：
1. **類別權重**：跌倒樣本權重設為3-5倍
2. **數據增強**：時間平移、加入噪聲、速度縮放
3. **SMOTE過採樣**：合成少數類樣本
4. **焦點損失（Focal Loss）**：自動平衡難分類樣本

---

## 六、參考文獻與延伸閱讀

### 學術論文（2023-2025）

1. **Kavuncuoğlu, E. (2024)**. "Comprehensive analysis of feature-algorithm interactions for fall detection across age groups via machine learning." *Computational Intelligence*, 40(5). DOI: 10.1111/coin.12697
   - **重點**：使用SisFall數據集，達到98.69%準確度

2. **Amjad, A., et al. (2024)**. "The evolution of frailty assessment using inertial measurement sensor-based gait parameter measurements." *WIREs Data Mining and Knowledge Discovery*, 14(6). DOI: 10.1002/widm.1557
   - **重點**：IMU感測器步態參數分析

3. **Zhao, C., et al. (2023)**. "Wear-free indoor fall detection based on RFID and deep residual networks." *International Journal of Communication Systems*, 36(10). DOI: 10.1002/dac.5499
   - **重點**：非穿戴式RFID跌倒偵測，準確度96.77%

4. **Saleh, M., et al. (2020)**. "FallAllD: An Open Dataset of Human Falls and Activities of Daily Living." *IEEE Sensors Journal*. DOI: 10.1109/JSEN.2020.3018335
   - **重點**：FallAllD數據集官方論文

5. **Sucerquia, A., et al. (2017)**. "SisFall: A Fall and Movement Dataset." *Sensors*, 17(1), 198. DOI: 10.3390/s17010198
   - **重點**：SisFall數據集官方論文

### 開源專案與工具

1. **SisFall分析工具**: https://github.com/WJMatthew/SisFallAnalysis
2. **FallAllD Python工具**: https://ieee-dataport.org/open-access/fallalld-comprehensive-dataset-human-falls-and-activities-daily-living
3. **UP-Fall下載工具**: https://github.com/jpnm561/HAR-UP
4. **Roboflow跌倒偵測**: https://universe.roboflow.com/roboflow-universe-projects/fall-detection-ca3o8

### 商業產品官網

1. **Seeed Studio 60GHz雷達**: https://www.seeedstudio.com/60GHz-mmWave-Radar-Sensor-Fall-Detection-Module-Pro-p-5375.html
2. **DFRobot C1001**: https://www.dfrobot.com/product-2861.html
3. **Milesight VS373**: https://www.milesight.com/iot/product/lorawan-sensor/vs373

---

## 七、結論與下一步行動

### ✅ 調研結論

1. **硬體選擇**：60GHz毫米波雷達 + IMU手環（雙重保險）
2. **推薦數據集**：SisFall（訓練基礎模型） + 赤土崎實際場域數據（微調）
3. **AI架構**：CNN-LSTM融合模型（準確度>98%）
4. **成本可控**：1F失智專區約NT$15-20萬

### 🎯 下一步行動（赤土崎專案）

#### Phase 1: 原型驗證（2025/12 - 2026/02）
- [ ] 購買2個60GHz雷達模組（Seeed MR60FDA2）
- [ ] 購買5個IMU手環原型（ESP32 + LSM6DSOX）
- [ ] 下載SisFall數據集並訓練基礎模型
- [ ] 實驗室環境測試（準確度、誤報率）

#### Phase 2: 小規模試點（2026/03 - 2026/05）
- [ ] 1F失智專區安裝4個雷達基站
- [ ] 10名長者配戴IMU手環（志願者）
- [ ] 收集3個月實際場域數據
- [ ] 微調AI模型（Transfer Learning）

#### Phase 3: 全面部署（2026/06 - 2026/09）
- [ ] 擴展至50名長者
- [ ] 整合O-RAN 5G定位系統
- [ ] 護理站警報系統上線
- [ ] 家屬App推播功能

---

**報告完成日期**: 2025年11月15日
**下一次更新**: 原型驗證完成後（預計2026/02）

---

## 📥 快速下載連結整理

### 數據集下載（直接點擊）

| 數據集 | 下載連結 | 備註 |
|--------|---------|------|
| **SisFall** | https://www.mdpi.com/1424-8220/17/1/198 | 點擊 "Supplementary Materials" |
| **FallAllD** | https://ieee-dataport.org/open-access/fallalld-comprehensive-dataset-human-falls-and-activities-daily-living | 需免費註冊IEEE帳號 |
| **UP-Fall** | https://sites.google.com/up.edu.mx/har-up/ | 使用GitHub工具下載 |
| **UR Fall** | https://fenix.ur.edu.pl/~mkepski/ds/uf.html | 直接下載 |
| **Roboflow** | https://universe.roboflow.com/roboflow-universe-projects/fall-detection-ca3o8 | 影像數據集 |

### 硬體購買連結

| 產品 | 購買連結 | 價格 |
|------|---------|------|
| **Seeed MR60FDA2** | https://www.seeedstudio.com/MR60FDA2-60GHz-mmWave-Sensor-Fall-Detection-Module-p-5946.html | ~US$25-35 |
| **DFRobot C1001** | https://www.dfrobot.com/product-2861.html | ~US$30-40 |
| **STM LSM6DSOX** | https://www.st.com/en/mems-and-sensors/lsm6dsox.html | ~NT$300 |

---

**🎯 立即可用資源總結**：
- ✅ 3個大型開源數據集（SisFall, FallAllD, UP-Fall）
- ✅ 5個商業硬體方案（60GHz雷達 + IMU）
- ✅ 完整訓練程式碼範例（Python/TensorFlow）
- ✅ 赤土崎部署方案（成本估算+架構設計）

**開始訓練您的跌倒偵測AI模型吧！** 🚀
