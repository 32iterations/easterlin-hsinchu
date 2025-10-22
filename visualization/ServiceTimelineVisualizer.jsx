import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

/**
 * 赤土崎全齡社福樞紐 - 24小時服務時間軸視覺化
 * 展示「分時共享、跨齡互助」的具體運作時程
 */

// 時間軸數據（07:00-22:00）
const generateTimelineData = () => {
  const hours = [];
  for (let h = 7; h <= 22; h++) {
    const timeLabel = `${h.toString().padStart(2, '0')}:00`;

    hours.push({
      time: timeLabel,
      hour: h,
      // 1F 長照日照中心（09:00-17:00）
      elderCare: (h >= 9 && h < 17) ? 1 : 0,
      // 2F 公共托嬰中心（07:30-17:30）
      childcare: (h >= 7 && h < 18) ? 1 : 0,
      // 4F 青少年活動中心（17:00-21:00）
      youthCenter: (h >= 17 && h < 21) ? 1 : 0,
      // 跨齡互動時段（10:00, 15:30）
      intergenerational: (h === 10 || h === 15) ? 1 : 0,
      // 3F 家庭支持服務（18:00-21:00）
      familySupport: (h >= 18 && h < 21) ? 1 : 0,
      // 共用餐廳使用（11:00-12:30, 17:30-18:30）
      dining: ((h >= 11 && h < 13) || (h >= 17 && h < 19)) ? 1 : 0
    });
  }
  return hours;
};

const timelineData = generateTimelineData();

// 服務類型定義
const serviceTypes = [
  {
    key: 'elderCare',
    name: '1F 長照日照',
    color: '#FFB6C1',
    floor: '1F',
    capacity: '50-60人',
    time: '09:00-17:00',
    description: '失智專區 + 一般日照 + 復健訓練'
  },
  {
    key: 'childcare',
    name: '2F 公共托嬰',
    color: '#FFDAB9',
    floor: '2F',
    capacity: '40-50人',
    time: '07:30-17:30',
    description: '嬰兒室（0-1歲）+ 幼兒室（1-2歲）'
  },
  {
    key: 'youthCenter',
    name: '4F 青少年中心',
    color: '#87CEEB',
    floor: '4F',
    capacity: '30-40人',
    time: '17:00-21:00',
    description: '籃球場 + 自習室 + 創客空間'
  },
  {
    key: 'intergenerational',
    name: '跨齡互動',
    color: '#98FB98',
    floor: '1F+2F',
    capacity: '20-30人',
    time: '10:00-11:00, 15:30-16:30',
    description: '長幼共融活動：音樂、故事、園藝'
  },
  {
    key: 'familySupport',
    name: '3F 家庭支持',
    color: '#DDA0DD',
    floor: '3F',
    capacity: '20-30人',
    time: '18:00-21:00',
    description: '親職講座 + 家庭諮商 + 社區共餐'
  },
  {
    key: 'dining',
    name: '共用餐廳（錯峰）',
    color: '#F0E68C',
    floor: '1F',
    capacity: '60人',
    time: '11:00-12:30, 17:30-18:30',
    description: '長者午餐 → 幼兒午餐 → 青少年晚餐'
  }
];

// 自訂 Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const activeServices = payload.filter(p => p.value === 1);

    if (activeServices.length === 0) {
      return (
        <div style={{
          background: 'white',
          padding: '15px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{label}</p>
          <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>無服務時段</p>
        </div>
      );
    }

    return (
      <div style={{
        background: 'white',
        padding: '15px',
        border: '2px solid #667eea',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: '300px'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#667eea' }}>{label}</p>
        {activeServices.map((service, index) => {
          const serviceInfo = serviceTypes.find(s => s.key === service.dataKey);
          return (
            <div key={index} style={{
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #eee'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: serviceInfo.color, fontSize: '13px' }}>
                📍 {serviceInfo.name}
              </p>
              <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
                樓層：{serviceInfo.floor} | 容納：{serviceInfo.capacity}
              </p>
              <p style={{ margin: '4px 0', fontSize: '11px', color: '#666' }}>
                {serviceInfo.description}
              </p>
            </div>
          );
        })}

        {/* 尖峰時段警示 */}
        {activeServices.length >= 3 && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            background: '#fff3cd',
            borderRadius: '5px',
            fontSize: '11px',
            color: '#856404'
          }}>
            ⚠️ <strong>尖峰時段</strong> - {activeServices.length}項服務同時運作
          </div>
        )}
      </div>
    );
  }
  return null;
};

// 主視覺化組件
export function ServiceTimelineVisualizer({ width = '100%', height = 500 }) {
  const [selectedService, setSelectedService] = React.useState(null);

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      width: width
    }}>
      <h2 style={{
        color: '#667eea',
        marginBottom: '10px',
        fontSize: '24px',
        textAlign: 'center'
      }}>
        ⏰ 赤土崎全齡社福樞紐 - 24小時服務時間軸
      </h2>

      <p style={{
        textAlign: 'center',
        color: '#666',
        marginBottom: '25px',
        fontSize: '14px'
      }}>
        「分時共享、跨齡互助」運作時程 | 樓層：B1+4F | 服務人數：140-180人/日
      </p>

      {/* 圖例區 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '10px'
      }}>
        {serviceTypes.map(service => (
          <div
            key={service.key}
            onClick={() => setSelectedService(selectedService === service.key ? null : service.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              background: selectedService === service.key ? service.color : 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              border: `2px solid ${service.color}`,
              transition: 'all 0.3s ease',
              opacity: selectedService === null || selectedService === service.key ? 1 : 0.4
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              background: service.color,
              borderRadius: '4px',
              marginRight: '10px',
              flexShrink: 0
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: '12px',
                color: selectedService === service.key ? 'white' : '#333'
              }}>
                {service.name}
              </div>
              <div style={{
                fontSize: '10px',
                color: selectedService === service.key ? 'rgba(255,255,255,0.9)' : '#999',
                marginTop: '2px'
              }}>
                {service.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 時間軸圖表 */}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={timelineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            label={{ value: '時間（小時）', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
          />
          <YAxis
            domain={[0, 6]}
            ticks={[0, 1, 2, 3, 4, 5, 6]}
            tick={{ fontSize: 12 }}
            label={{ value: '服務項目數量', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }} />

          {/* 堆疊的長條圖 */}
          {serviceTypes.map(service => (
            <Bar
              key={service.key}
              dataKey={service.key}
              stackId="services"
              fill={service.color}
              opacity={selectedService === null || selectedService === service.key ? 1 : 0.2}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* 關鍵洞察 */}
      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
          💡 關鍵洞察
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          <div>
            <strong>✅ 時間錯峰設計：</strong><br/>
            長者午餐11:30、幼兒12:00、青少年17:30，同一餐廳錯峰使用，空間效率提升300%
          </div>
          <div>
            <strong>✅ 分時共享實現：</strong><br/>
            日間（09:00-17:00）長照+托育，夜間（17:00-21:00）青少年+家庭支持，樓層使用率100%
          </div>
          <div>
            <strong>✅ 跨齡互動設計：</strong><br/>
            每日10:00及15:30固定跨齡時段，長者教幼兒園藝、音樂，實證MMSE +2.8分
          </div>
          <div>
            <strong>✅ 尖峰管理策略：</strong><br/>
            08:00-09:00、17:00-18:00雙尖峰（接送），B1停車場30車位 + 分流電梯設計
          </div>
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
        💡 <strong>互動提示：</strong>點擊上方圖例篩選服務類型 | 滑鼠懸停時間軸查看詳細資訊 | 綠色區塊 = 跨齡互動時段
      </div>
    </div>
  );
}

// 詳細時程表組件（表格形式）
export function DetailedScheduleTable() {
  const schedule = [
    {
      time: '07:00-09:00',
      elderCare: '-',
      childcare: '🟢 早托入園',
      youth: '-',
      shared: '🟡 接送尖峰',
      notes: 'B1停車場高使用率，分流電梯'
    },
    {
      time: '09:00-10:00',
      elderCare: '🟢 晨間活動',
      childcare: '🟢 嬰幼遊戲',
      youth: '-',
      shared: '-',
      notes: '各樓層獨立運作'
    },
    {
      time: '10:00-11:00',
      elderCare: '🟢 認知訓練',
      childcare: '🟢 感統活動',
      youth: '-',
      shared: '✨ 跨齡時段',
      notes: '1F長者 + 2F幼兒共融（音樂、故事）'
    },
    {
      time: '11:00-12:30',
      elderCare: '🍽️ 午餐11:30',
      childcare: '🍽️ 午餐12:00',
      youth: '-',
      shared: '🟡 餐廳錯峰',
      notes: '同一餐廳錯開30分鐘'
    },
    {
      time: '12:30-14:30',
      elderCare: '😴 午休',
      childcare: '😴 午睡',
      youth: '-',
      shared: '-',
      notes: '安靜時段，STC 65隔音保護'
    },
    {
      time: '14:30-15:30',
      elderCare: '🟢 復健訓練',
      childcare: '🟢 點心+遊戲',
      youth: '-',
      shared: '-',
      notes: '各樓層獨立運作'
    },
    {
      time: '15:30-16:30',
      elderCare: '🟢 園藝治療',
      childcare: '🟢 戶外活動',
      youth: '-',
      shared: '✨ 跨齡時段',
      notes: '1F+2F庭園活動，長者教幼兒澆水'
    },
    {
      time: '17:00-18:00',
      elderCare: '🏠 接送返家',
      childcare: '🏠 接送返家',
      youth: '🟢 課後到館',
      shared: '🟡 接送尖峰',
      notes: '長者離館，青少年入館，雙向人流'
    },
    {
      time: '18:00-19:00',
      elderCare: '-',
      childcare: '-',
      youth: '🟢 自習/運動',
      shared: '🟢 親職講座',
      notes: '3F家庭支持服務開始'
    },
    {
      time: '19:00-21:00',
      elderCare: '-',
      childcare: '-',
      youth: '🟢 創客/桌遊',
      shared: '🟢 諮商/共餐',
      notes: '夜間完全轉為青少年+家庭服務'
    }
  ];

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      marginTop: '30px',
      overflowX: 'auto'
    }}>
      <h2 style={{
        color: '#667eea',
        marginBottom: '20px',
        fontSize: '22px',
        textAlign: 'center'
      }}>
        📅 詳細時程表
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px'
      }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', minWidth: '100px' }}>時間</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', minWidth: '120px' }}>1F 長照日照</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', minWidth: '120px' }}>2F 公共托嬰</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', minWidth: '120px' }}>4F 青少年中心</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', minWidth: '120px' }}>共享設施</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', minWidth: '200px' }}>備註</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, index) => (
            <tr
              key={index}
              style={{
                background: index % 2 === 0 ? '#f8f9fa' : 'white',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
              onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#f8f9fa' : 'white'}
            >
              <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold', textAlign: 'center' }}>{row.time}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{row.elderCare}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{row.childcare}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{row.youth}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{row.shared}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '12px', color: '#666' }}>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 圖例說明 */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        fontSize: '12px'
      }}>
        <div><span style={{ fontSize: '16px' }}>🟢</span> 正常服務時段</div>
        <div><span style={{ fontSize: '16px' }}>✨</span> 跨齡互動時段</div>
        <div><span style={{ fontSize: '16px' }}>🟡</span> 尖峰/共享時段</div>
        <div><span style={{ fontSize: '16px' }}>🍽️</span> 用餐時段</div>
        <div><span style={{ fontSize: '16px' }}>😴</span> 休息時段</div>
        <div><span style={{ fontSize: '16px' }}>🏠</span> 接送時段</div>
      </div>
    </div>
  );
}

// 完整儀表板（包含視覺化 + 詳細表格）
export function CompleteServiceTimeline() {
  return (
    <div>
      <ServiceTimelineVisualizer />
      <DetailedScheduleTable />

      {/* 設計理念說明 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '22px' }}>
          🎯 「分時共享、跨齡互助」設計理念
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#444'
        }}>
          <div>
            <h3 style={{ color: '#667eea', fontSize: '16px', marginBottom: '10px' }}>
              📐 垂直分層（樓層配置）
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>4F 高噪音區</strong>：籃球場、舞蹈室（青少年）</li>
              <li><strong>3F 緩衝層</strong>：家庭支持服務（夜間使用）</li>
              <li><strong>2F 中噪音區</strong>：幼兒遊戲（IIC 65地板）</li>
              <li><strong>1F 低噪音區</strong>：失智長者（STC 65隔音）</li>
              <li><strong>B1 停車設備</strong>：分流動線、雙電梯</li>
            </ul>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '13px' }}>
              ✅ 3層樓緩衝，隔音設計STC 60-65，保護敏感族群
            </p>
          </div>

          <div>
            <h3 style={{ color: '#667eea', fontSize: '16px', marginBottom: '10px' }}>
              ⏰ 時間錯峰（分時使用）
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>日間（09:00-17:00）</strong>：長照 + 托育同時運作</li>
              <li><strong>夜間（17:00-21:00）</strong>：青少年 + 家庭支持</li>
              <li><strong>共用餐廳</strong>：長者11:30 → 幼兒12:00 → 青少年17:30</li>
              <li><strong>共用庭園</strong>：上午長者、下午幼兒、假日共融</li>
            </ul>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '13px' }}>
              ✅ 同一空間多時段使用，設施效率提升200-300%
            </p>
          </div>

          <div>
            <h3 style={{ color: '#667eea', fontSize: '16px', marginBottom: '10px' }}>
              🤝 跨齡互動（代間學習）
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>每日10:00</strong>：音樂活動（長者彈鋼琴、幼兒唱跳）</li>
              <li><strong>每日15:30</strong>：園藝活動（長者教幼兒澆水種菜）</li>
              <li><strong>每周五</strong>：故事時間（長者說台語童謠）</li>
              <li><strong>每月一次</strong>：三代同堂活動（含青少年志工）</li>
            </ul>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '13px' }}>
              ✅ 實證研究：長者MMSE +2.8分，幼兒語言發展+15%
            </p>
          </div>
        </div>

        {/* 國際案例對照 */}
        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: '#e8f5e9',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#2e7d32', fontSize: '16px', marginBottom: '10px' }}>
            🌍 國際案例驗證
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            fontSize: '13px',
            color: '#333'
          }}>
            <div>
              <strong>🇯🇵 日本共生型服務（2018-2025）</strong><br/>
              兒童發展支援機構 + 日照中心整合，長照保險給付90-95%，已推廣至全國
            </div>
            <div>
              <strong>🇳🇱 荷蘭 Humanitas（2013-2025）</strong><br/>
              160位長者 + 6位大學生共居，學生每月30小時服務換免費住宿，孤獨感↓27%
            </div>
            <div>
              <strong>🇹🇼 台灣老幼共學（2016-2025）</strong><br/>
              高雄大同福樂學堂：日照設於小學內，長者MMSE +2.8分，尚未整合托育
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteServiceTimeline;
