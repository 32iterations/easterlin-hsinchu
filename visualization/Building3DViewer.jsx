import React, { useState, useEffect } from 'react';

/**
 * 3D 建築視覺化組件
 * 使用 CSS 3D transforms 創建輕量級 3D 效果
 * 展示赤土崎多功能館完整建築結構（B1+4F）
 */

// 樓層數據
const floorData = {
  'B1': {
    name: 'B1 停車場與設備層',
    color: '#78909C',
    icon: '🚗',
    height: 60,
    area: '600 m²',
    features: ['30個停車位', '設備機房', '儲藏空間', '電梯機房'],
    capacity: '30車位',
    purpose: '家長接送動線 + 建築設備'
  },
  '1F': {
    name: '1F 長照日照中心',
    color: '#FFB6C1',
    icon: '👴',
    height: 80,
    area: '800 m²',
    features: ['失智專區 200m²', '一般日照 300m²', '復健訓練室', '護理站', '營養餐廳'],
    capacity: '50-60人',
    purpose: '長輩日間照顧 + 失智專區'
  },
  '2F': {
    name: '2F 公共托嬰中心',
    color: '#FFE4B5',
    icon: '👶',
    height: 80,
    area: '700 m²',
    features: ['嬰幼兒活動區', '午睡室', '遊戲治療室', '親子共學空間', '廚房'],
    capacity: '40-50人',
    purpose: '0-2歲托育 + 親子活動'
  },
  '3F': {
    name: '3F 家庭支持服務',
    color: '#98FB98',
    icon: '👨‍👩‍👧',
    height: 80,
    area: '500 m²',
    features: ['諮商室4間', '親職講座廳', '課後照顧班', '資源媒合中心'],
    capacity: '20-30人',
    purpose: '家庭諮商 + 課後照顧'
  },
  '4F': {
    name: '4F 青少年活動中心',
    color: '#DDA0DD',
    icon: '🎮',
    height: 80,
    area: '500 m²',
    features: ['自習空間', '多功能活動室', '創客工坊', '音樂練習室', '社團教室'],
    capacity: '30-40人',
    purpose: '青少年活動 + 職涯探索'
  },
  'RF': {
    name: 'RF 屋頂層',
    color: '#B0BEC5',
    icon: '☀️',
    height: 40,
    area: '500 m²',
    features: ['太陽能板', '空調設備', '水塔', '屋頂花園（預留）'],
    capacity: '設備區',
    purpose: '綠能設備 + 屋頂綠化'
  }
};

// 建築規格
const buildingSpec = {
  totalArea: '3,100 m²',
  totalHeight: '24 m',
  floors: 'B1 + 4F + RF',
  structure: 'RC鋼筋混凝土',
  capacity: '140-180人',
  parking: '30車位',
  construction: '2,287萬設計費 + 1.5-2.3億工程費',
  timeline: '2025/10/30開標 → 2027完工'
};

// 主組件
export function Building3DViewer() {
  const [rotateX, setRotateX] = useState(-20);
  const [rotateY, setRotateY] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [exploded, setExploded] = useState(false);

  // 自動旋轉效果
  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setRotateY(prev => (prev + 0.5) % 360);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  return (
    <div style={{ padding: '30px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 標題區 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>
          🏢 3D 建築視覺化
        </h1>
        <p style={{ margin: 0, fontSize: '1.2em', opacity: 0.95 }}>
          赤土崎全齡社福樞紐 - 互動式 3D 建築模型
        </p>
      </div>

      {/* 建築規格卡 */}
      <BuildingSpecCard spec={buildingSpec} />

      {/* 控制面板 */}
      <ControlPanel
        rotateX={rotateX}
        rotateY={rotateY}
        zoom={zoom}
        autoRotate={autoRotate}
        exploded={exploded}
        setRotateX={setRotateX}
        setRotateY={setRotateY}
        setZoom={setZoom}
        setAutoRotate={setAutoRotate}
        setExploded={setExploded}
      />

      {/* 3D 建築視圖 */}
      <Building3DView
        rotateX={rotateX}
        rotateY={rotateY}
        zoom={zoom}
        exploded={exploded}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
      />

      {/* 樓層詳細資訊 */}
      {selectedFloor && (
        <FloorDetailPanel
          floor={floorData[selectedFloor]}
          floorKey={selectedFloor}
          onClose={() => setSelectedFloor(null)}
        />
      )}

      {/* 樓層列表 */}
      <FloorList
        floorData={floorData}
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
      />

      {/* 設計亮點 */}
      <DesignHighlights />
    </div>
  );
}

// 建築規格卡組件
function BuildingSpecCard({ spec }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 建築規格</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        {[
          { label: '總樓地板面積', value: spec.totalArea, icon: '📐', color: '#4CAF50' },
          { label: '建築高度', value: spec.totalHeight, icon: '📏', color: '#2196F3' },
          { label: '樓層數', value: spec.floors, icon: '🏗️', color: '#FF9800' },
          { label: '結構系統', value: spec.structure, icon: '🔧', color: '#9C27B0' },
          { label: '使用容量', value: spec.capacity, icon: '👥', color: '#F44336' },
          { label: '停車位', value: spec.parking, icon: '🚗', color: '#00BCD4' },
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: `5px solid ${item.color}`
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>{item.icon}</div>
            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '5px' }}>{item.label}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 控制面板組件
function ControlPanel({
  rotateX, rotateY, zoom, autoRotate, exploded,
  setRotateX, setRotateY, setZoom, setAutoRotate, setExploded
}) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🎮 視角控制</h2>
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* X軸旋轉 */}
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
              🔄 水平旋轉: {rotateY.toFixed(0)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotateY}
              onChange={(e) => setRotateY(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Y軸旋轉 */}
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
              ⬆️ 垂直旋轉: {rotateX.toFixed(0)}°
            </label>
            <input
              type="range"
              min="-90"
              max="90"
              value={rotateX}
              onChange={(e) => setRotateX(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* 縮放 */}
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
              🔍 縮放: {(zoom * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: autoRotate ? '#4CAF50' : '#667eea',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {autoRotate ? '⏸️ 停止旋轉' : '▶️ 自動旋轉'}
          </button>

          <button
            onClick={() => setExploded(!exploded)}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: exploded ? '#FF9800' : '#667eea',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {exploded ? '📦 合併樓層' : '💥 爆炸視圖'}
          </button>

          <button
            onClick={() => {
              setRotateX(-20);
              setRotateY(30);
              setZoom(1);
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#9C27B0',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 重置視角
          </button>
        </div>
      </div>
    </div>
  );
}

// 3D 建築視圖組件
function Building3DView({ rotateX, rotateY, zoom, exploded, selectedFloor, setSelectedFloor }) {
  const floors = ['RF', '4F', '3F', '2F', '1F', 'B1'];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🏗️ 3D 建築模型</h2>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          perspective: '1500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '600px'
        }}>
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `
                scale(${zoom})
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
              `,
              transition: 'transform 0.3s ease'
            }}
          >
            {floors.map((floorKey, idx) => {
              const floor = floorData[floorKey];
              const baseY = floors.slice(idx + 1).reduce((sum, key) => sum + floorData[key].height, 0);
              const explosionOffset = exploded ? (floors.length - idx - 1) * 60 : 0;

              return (
                <div
                  key={floorKey}
                  onClick={() => setSelectedFloor(floorKey)}
                  style={{
                    position: 'absolute',
                    width: '400px',
                    height: `${floor.height}px`,
                    background: floor.color,
                    border: selectedFloor === floorKey ? '4px solid #667eea' : '2px solid rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    transformStyle: 'preserve-3d',
                    transform: `translateY(-${baseY + explosionOffset}px) translateZ(0)`,
                    transition: 'all 0.5s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    opacity: selectedFloor && selectedFloor !== floorKey ? 0.5 : 1
                  }}
                >
                  <div style={{
                    fontSize: '3em',
                    marginBottom: '10px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {floor.icon}
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.3em',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    marginBottom: '5px',
                    textAlign: 'center'
                  }}>
                    {floorKey}
                  </div>
                  <div style={{
                    fontSize: '0.9em',
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    textAlign: 'center'
                  }}>
                    {floor.area} | {floor.capacity}
                  </div>

                  {/* 側面 */}
                  {[0, 90, 180, 270].map(angle => (
                    <div
                      key={angle}
                      style={{
                        position: 'absolute',
                        width: angle % 180 === 0 ? '400px' : '300px',
                        height: `${floor.height}px`,
                        background: `linear-gradient(180deg, ${floor.color} 0%, rgba(0,0,0,0.3) 100%)`,
                        transformOrigin: 'center center',
                        transform: `
                          rotateY(${angle}deg)
                          translateZ(${angle % 180 === 0 ? 150 : 200}px)
                        `,
                        border: '1px solid rgba(0,0,0,0.2)',
                        pointerEvents: 'none'
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#e8f5e9',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#2e7d32'
        }}>
          💡 <strong>提示：</strong> 點擊任意樓層查看詳細資訊 | 使用滑桿調整視角
        </div>
      </div>
    </div>
  );
}

// 樓層詳細資訊面板
function FloorDetailPanel({ floor, floorKey, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}
    onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '3px solid #eee'
        }}>
          <div style={{ fontSize: '4em', marginRight: '20px' }}>{floor.icon}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 10px 0', color: floor.color }}>{floor.name}</h2>
            <div style={{ color: '#666', fontSize: '1.1em' }}>
              {floor.area} | 容量：{floor.capacity}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#f44336',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.1em'
            }}
          >
            ✕ 關閉
          </button>
        </div>

        <div style={{
          background: floor.color,
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>功能定位</h3>
          <p style={{ margin: 0, fontSize: '1.1em' }}>{floor.purpose}</p>
        </div>

        <h3 style={{ color: '#333', marginBottom: '15px' }}>主要設施</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          {floor.features.map((feature, idx) => (
            <div key={idx} style={{
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '8px',
              borderLeft: `4px solid ${floor.color}`,
              fontSize: '0.95em'
            }}>
              ✓ {feature}
            </div>
          ))}
        </div>

        <div style={{
          padding: '20px',
          background: '#fff3cd',
          borderLeft: '5px solid #FFC107',
          borderRadius: '8px',
          color: '#856404'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>💡 設計亮點</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {floorKey === '1F' && (
              <>
                <li>失智友善設計：環狀動線、色彩標示</li>
                <li>跨齡共融：長者與幼兒共享空間</li>
                <li>無障礙通道：全面符合無障礙法規</li>
              </>
            )}
            {floorKey === '2F' && (
              <>
                <li>感覺統合設施：遊戲治療室</li>
                <li>親子共學空間：促進親子互動</li>
                <li>安全防護：軟質地板、圓角設計</li>
              </>
            )}
            {floorKey === '3F' && (
              <>
                <li>4間獨立諮商室：隱私性佳</li>
                <li>親職講座廳：80人容量</li>
                <li>課後照顧：彈性空間設計</li>
              </>
            )}
            {floorKey === '4F' && (
              <>
                <li>自習空間：安靜舒適</li>
                <li>創客工坊：STEAM教育</li>
                <li>音樂練習室：隔音處理</li>
              </>
            )}
            {floorKey === 'B1' && (
              <>
                <li>30個停車位：充足停車空間</li>
                <li>快速接送動線：減少等候時間</li>
                <li>設備集中管理：維護效率高</li>
              </>
            )}
            {floorKey === 'RF' && (
              <>
                <li>太陽能發電：綠色建築</li>
                <li>屋頂綠化：降低熱島效應</li>
                <li>設備維護便利：集中配置</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 樓層列表組件
function FloorList({ floorData, selectedFloor, setSelectedFloor }) {
  const floors = ['RF', '4F', '3F', '2F', '1F', 'B1'];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 樓層總覽</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {floors.map(floorKey => {
          const floor = floorData[floorKey];
          return (
            <div
              key={floorKey}
              onClick={() => setSelectedFloor(floorKey)}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                border: selectedFloor === floorKey ? `3px solid ${floor.color}` : '3px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div style={{ fontSize: '2.5em', marginRight: '15px' }}>{floor.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    color: floor.color,
                    marginBottom: '5px'
                  }}>
                    {floorKey}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {floor.area} | {floor.capacity}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.95em',
                color: '#333',
                marginBottom: '15px',
                lineHeight: '1.6'
              }}>
                {floor.purpose}
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {floor.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} style={{
                    background: floor.color,
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '0.85em'
                  }}>
                    {feature}
                  </span>
                ))}
                {floor.features.length > 3 && (
                  <span style={{
                    background: '#eee',
                    color: '#666',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '0.85em'
                  }}>
                    +{floor.features.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 設計亮點組件
function DesignHighlights() {
  const highlights = [
    {
      title: '跨齡共融設計',
      icon: '👨‍👩‍👧‍👦',
      description: '長照、托育、青少年三代服務整合於同一建築',
      benefits: ['減少家庭接送時間', '促進跨世代互動', '資源集中共享'],
      color: '#4CAF50'
    },
    {
      title: '分時共享策略',
      icon: '⏰',
      description: '不同服務錯峰使用，提升空間利用率',
      benefits: ['24小時不間斷服務', '降低閒置率', '成本效益最佳化'],
      color: '#2196F3'
    },
    {
      title: '無障礙通用設計',
      icon: '♿',
      description: '全館無障礙動線，適合各年齡層使用',
      benefits: ['符合建築法規', '長者友善', '輪椅可通行'],
      color: '#FF9800'
    },
    {
      title: '智慧建築系統',
      icon: '🤖',
      description: '整合IoT、AI監控，即時掌握使用狀況',
      benefits: ['環境監測', '能源管理', '安全預警'],
      color: '#9C27B0'
    },
    {
      title: '綠色建築設計',
      icon: '🌱',
      description: '太陽能、雨水回收、自然通風',
      benefits: ['節能減碳', '降低營運成本', '符合綠建築標準'],
      color: '#00BCD4'
    },
    {
      title: '彈性空間規劃',
      icon: '🔄',
      description: '可調整隔間，因應未來需求變化',
      benefits: ['適應性強', '擴充彈性', '永續發展'],
      color: '#F44336'
    }
  ];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>✨ 設計亮點</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {highlights.map((highlight, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: `5px solid ${highlight.color}`
          }}>
            <div style={{ fontSize: '3em', marginBottom: '15px', textAlign: 'center' }}>
              {highlight.icon}
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: highlight.color, textAlign: 'center' }}>
              {highlight.title}
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#666', textAlign: 'center', fontSize: '0.95em' }}>
              {highlight.description}
            </p>
            <div style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                核心優勢：
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '0.9em' }}>
                {highlight.benefits.map((benefit, idx) => (
                  <li key={idx} style={{ marginBottom: '5px' }}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Building3DViewer;
