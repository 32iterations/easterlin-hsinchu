import React from 'react';

/**
 * 互動式空間導覽系統
 * 赤土崎全齡社福樞紐 - 3D視覺化樓層導覽
 */

// 樓層數據
const floorData = {
  'B1': {
    name: 'B1 停車場與設備層',
    color: '#607d8b',
    areas: [
      { id: 'B1-parking', name: '停車場', capacity: '30車位', description: '親子優先車位5格、無障礙車位5格、一般車位20格', icon: '🚗', size: '450 m²' },
      { id: 'B1-hvac', name: '空調機房', capacity: '150RT', description: '中央空調主機2組、HEPA H13過濾系統', icon: '❄️', size: '30 m²' },
      { id: 'B1-electric', name: '配電室', capacity: '800A', description: '主配電盤、緊急發電機100KW', icon: '⚡', size: '20 m²' },
      { id: 'B1-storage', name: '倉儲空間', capacity: '分4區', description: '長照物資、托育物資、清潔用品、備用設備', icon: '📦', size: '60 m²' }
    ],
    highlights: ['分流電梯設計', '24小時監控', '智慧停車管理']
  },
  '1F': {
    name: '1F 長照日照中心',
    color: '#FFB6C1',
    areas: [
      { id: '1F-dementia', name: '失智專區', capacity: '20-25人', description: 'STC 65隔音、低刺激環境、徘徊走廊', icon: '🧠', size: '200 m²' },
      { id: '1F-general', name: '一般日照區', capacity: '30-35人', description: '團體活動室、復健訓練室、休息室', icon: '👴', size: '300 m²' },
      { id: '1F-dining', name: '共用餐廳', capacity: '60人', description: '錯峰用餐：長者11:30、幼兒12:00、青少年17:30', icon: '🍽️', size: '120 m²' },
      { id: '1F-garden', name: '無障礙庭園', capacity: '開放', description: '園藝治療、跨齡互動、戶外活動', icon: '🌳', size: '60 m²' },
      { id: '1F-nurse', name: '護理站', capacity: '-', description: '健康監測、緊急處置、藥物管理', icon: '💉', size: '25 m²' }
    ],
    highlights: ['失智友善設計', '跨齡共融空間', '護理師駐點']
  },
  '2F': {
    name: '2F 公共托嬰中心',
    color: '#FFDAB9',
    areas: [
      { id: '2F-infant', name: '嬰兒室（0-1歲）', capacity: '15-18人', description: '爬行墊、午睡室、調乳室、尿布更換區', icon: '👶', size: '180 m²' },
      { id: '2F-toddler', name: '幼兒室（1-2歲）', capacity: '25-30人', description: 'IIC 65地板、遊戲區、午睡室、閱讀角', icon: '🧸', size: '250 m²' },
      { id: '2F-dining', name: '幼兒餐廳', capacity: '50人', description: '與1F錯峰用餐、幼兒餐椅、微波爐', icon: '🍼', size: '60 m²' },
      { id: '2F-outdoor', name: '戶外遊戲區', capacity: '開放', description: '沙坑、戲水池、種植區、騎乘區', icon: '🌞', size: '85 m²' },
      { id: '2F-health', name: '保健室', capacity: '隔離觀察', description: '發燒幼兒隔離、簡易處置、獨立空調', icon: '🏥', size: '15 m²' }
    ],
    highlights: ['師生比1:5-1:8', 'APP即時照片', '感染控制標準']
  },
  '3F': {
    name: '3F 家庭支持服務中心',
    color: '#DDA0DD',
    areas: [
      { id: '3F-counseling', name: '諮商服務區', capacity: '4間諮商室', description: '個別諮商、家族治療、遊戲治療', icon: '💬', size: '150 m²' },
      { id: '3F-workshop', name: '親職教育區', capacity: '50人', description: '多功能教室、親子烹飪、手作工作坊', icon: '📚', size: '180 m²' },
      { id: '3F-kitchen', name: '社區共餐廚房', capacity: '130人/日', description: '營業級廚房、長青食堂、獨居長者送餐', icon: '🍲', size: '60 m²' },
      { id: '3F-volunteer', name: '志工培訓室', capacity: '30人', description: '志工招募、培訓、督導會議', icon: '🤝', size: '40 m²' }
    ],
    highlights: ['諮商心理師', '社區營造', '志工服務']
  },
  '4F': {
    name: '4F 青少年活動中心',
    color: '#87CEEB',
    areas: [
      { id: '4F-sports', name: '室內籃球場', capacity: '20人', description: 'IIC 70地板、半場規格、多功能使用', icon: '🏀', size: '150 m²' },
      { id: '4F-study', name: '自習室', capacity: '40座位', description: '個人座位隔板、檯燈、插座、空調', icon: '📖', size: '60 m²' },
      { id: '4F-computer', name: '電腦教室', capacity: '20台', description: 'i5電腦、程式教學、影片剪輯', icon: '💻', size: '50 m²' },
      { id: '4F-maker', name: '創客空間', capacity: '12人', description: '3D列印、Arduino、雷射雕刻', icon: '🔧', size: '40 m²' },
      { id: '4F-music', name: '團練室', capacity: '樂團', description: 'STC 65隔音、鼓組、音箱、錄音設備', icon: '🎸', size: '30 m²' },
      { id: '4F-lounge', name: '交誼廳', capacity: '15人', description: '桌遊、Switch、撞球、漫畫書櫃', icon: '🎮', size: '50 m²' }
    ],
    highlights: ['STEAM教育', '職涯探索', '同儕歸屬感']
  }
};

// 互動式樓層選擇器
function FloorSelector({ selectedFloor, onSelectFloor }) {
  const floors = ['4F', '3F', '2F', '1F', 'B1'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginRight: '30px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#667eea' }}>
        選擇樓層
      </h3>
      {floors.map(floor => {
        const data = floorData[floor];
        return (
          <button
            key={floor}
            onClick={() => onSelectFloor(floor)}
            style={{
              padding: '15px 20px',
              background: selectedFloor === floor ? data.color : '#f5f5f5',
              border: `3px solid ${selectedFloor === floor ? data.color : '#ddd'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              transform: selectedFloor === floor ? 'scale(1.05)' : 'scale(1)',
              color: selectedFloor === floor ? 'white' : '#333',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: '180px'
            }}
          >
            <div>{floor}</div>
            <div style={{
              fontSize: '11px',
              opacity: 0.9,
              marginTop: '4px',
              fontWeight: 'normal'
            }}>
              {data.name.replace(floor + ' ', '')}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// 樓層平面圖組件（簡化視覺化）
function FloorPlan({ floor, onSelectArea, selectedArea }) {
  const data = floorData[floor];

  return (
    <div style={{
      flex: 1,
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      border: `3px solid ${data.color}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '24px',
          color: data.color
        }}>
          {data.name}
        </h2>
        <div style={{
          padding: '8px 16px',
          background: data.color,
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          {floor}
        </div>
      </div>

      {/* 簡化的平面圖網格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {data.areas.map((area, index) => (
          <div
            key={area.id}
            onClick={() => onSelectArea(area)}
            style={{
              padding: '20px',
              background: selectedArea?.id === area.id ? data.color + '33' : '#f8f9fa',
              border: `2px solid ${selectedArea?.id === area.id ? data.color : '#ddd'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: selectedArea?.id === area.id ? 'translateY(-5px)' : 'translateY(0)',
              boxShadow: selectedArea?.id === area.id ? '0 8px 16px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>
              {area.icon}
            </div>
            <div style={{
              fontWeight: 'bold',
              fontSize: '15px',
              marginBottom: '8px',
              color: '#333',
              textAlign: 'center'
            }}>
              {area.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              容納：{area.capacity}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#999',
              textAlign: 'center'
            }}>
              {area.size}
            </div>
          </div>
        ))}
      </div>

      {/* 樓層亮點 */}
      <div style={{
        padding: '20px',
        background: data.color + '22',
        borderRadius: '12px',
        border: `2px solid ${data.color}`
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: data.color }}>
          ✨ 樓層亮點
        </h3>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          {data.highlights.map((highlight, index) => (
            <div
              key={index}
              style={{
                padding: '8px 16px',
                background: 'white',
                borderRadius: '20px',
                fontSize: '13px',
                color: data.color,
                fontWeight: 'bold',
                border: `2px solid ${data.color}77`
              }}
            >
              {highlight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 區域詳細資訊面板
function AreaDetailPanel({ area, floor }) {
  if (!area) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#999'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏢</div>
        <div style={{ fontSize: '16px' }}>點擊左側區域查看詳細資訊</div>
      </div>
    );
  }

  const floorColor = floorData[floor].color;

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      border: `3px solid ${floorColor}`
    }}>
      <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: '20px' }}>
        {area.icon}
      </div>

      <h2 style={{
        color: floorColor,
        fontSize: '24px',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        {area.name}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>樓層</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: floorColor }}>{floor}</div>
        </div>
        <div style={{
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>面積</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: floorColor }}>{area.size}</div>
        </div>
        <div style={{
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          textAlign: 'center',
          gridColumn: '1 / -1'
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>容納人數/規格</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: floorColor }}>{area.capacity}</div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        background: floorColor + '11',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '16px', color: floorColor, marginBottom: '10px' }}>
          📋 詳細說明
        </h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
          {area.description}
        </p>
      </div>

      {/* 相關功能 */}
      <div>
        <h3 style={{ fontSize: '16px', color: floorColor, marginBottom: '10px' }}>
          🔗 相關功能
        </h3>
        <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
          {area.id.includes('dining') && (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>錯峰用餐時間管理系統</li>
              <li>營養師菜單規劃</li>
              <li>食材溯源管理</li>
            </ul>
          )}
          {area.id.includes('nurse') && (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>即時健康監測儀表板</li>
              <li>藥物管理系統</li>
              <li>緊急通報機制（119直撥）</li>
            </ul>
          )}
          {area.id.includes('outdoor') && (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>跨齡共融活動時段：10:00、15:30</li>
              <li>園藝治療課程</li>
              <li>監視器全覆蓋（安全監控）</li>
            </ul>
          )}
          {!area.id.includes('dining') && !area.id.includes('nurse') && !area.id.includes('outdoor') && (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>預約系統整合</li>
              <li>使用率即時監控</li>
              <li>設備維護紀錄</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// 主組件
export function InteractiveSpaceNavigator() {
  const [selectedFloor, setSelectedFloor] = React.useState('1F');
  const [selectedArea, setSelectedArea] = React.useState(null);

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
      {/* 標題 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#667eea',
          margin: '0 0 10px 0',
          fontSize: '28px'
        }}>
          🏢 赤土崎全齡社福樞紐 - 互動式空間導覽
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
          3,100 m² | 5個樓層 | 140-180人服務容量 | 點擊探索各樓層功能
        </p>
      </div>

      {/* 主要導覽介面 */}
      <div style={{ display: 'flex', gap: '25px', marginBottom: '30px' }}>
        {/* 左側樓層選擇器 */}
        <FloorSelector
          selectedFloor={selectedFloor}
          onSelectFloor={(floor) => {
            setSelectedFloor(floor);
            setSelectedArea(null);
          }}
        />

        {/* 中間平面圖 */}
        <FloorPlan
          floor={selectedFloor}
          onSelectArea={setSelectedArea}
          selectedArea={selectedArea}
        />
      </div>

      {/* 下方區域詳細資訊 */}
      <AreaDetailPanel area={selectedArea} floor={selectedFloor} />

      {/* 綜合資訊卡片 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          📊 全館綜合資訊
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(floorData).map(([floor, data]) => {
            const totalAreas = data.areas.length;
            return (
              <div
                key={floor}
                style={{
                  padding: '20px',
                  background: data.color + '11',
                  borderRadius: '12px',
                  border: `2px solid ${data.color}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: data.color }}>
                    {floor}
                  </h3>
                  <div style={{
                    padding: '4px 12px',
                    background: data.color,
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {totalAreas}區域
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  {data.name}
                </div>
                <div style={{
                  marginTop: '10px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                  {data.areas.map(area => (
                    <span key={area.id} style={{ fontSize: '18px' }} title={area.name}>
                      {area.icon}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 操作提示 */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        💡 <strong>操作提示：</strong>左側選擇樓層 → 點擊中間區域卡片查看詳細資訊 → 下方顯示完整說明與相關功能
      </div>
    </div>
  );
}

export default InteractiveSpaceNavigator;
