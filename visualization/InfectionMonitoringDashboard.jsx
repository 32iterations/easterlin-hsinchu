import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * 感染監測儀表板原型
 * 基於CDC 2025 Viral Respiratory Pathogens Toolkit標準
 * 即時監控空氣品質、溫度、濕度、CO2、人員健康狀況
 */

// 模擬即時數據（實際應接API）
const generateMockData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:00`,
      co2: 450 + Math.random() * 350, // ppm
      temp: 22 + Math.random() * 4, // °C
      humidity: 50 + Math.random() * 15, // %
      pm25: Math.random() * 25, // μg/m³
      airChanges: 6 + Math.random() * 2, // ACH
      occupancy: Math.floor(Math.random() * 100) // %
    });
  }
  return data;
};

// 各樓層即時狀態
const floorStatus = [
  {
    floor: '1F',
    name: '長照日照',
    occupancy: 52,
    capacity: 60,
    temp: 24.2,
    humidity: 55,
    co2: 520,
    airQuality: 'good',
    alerts: [],
    color: '#FFB6C1'
  },
  {
    floor: '2F',
    name: '公共托嬰',
    occupancy: 43,
    capacity: 50,
    temp: 25.8,
    humidity: 58,
    co2: 680,
    airQuality: 'moderate',
    alerts: ['CO2偏高（建議<650ppm）'],
    color: '#FFDAB9'
  },
  {
    floor: '3F',
    name: '家庭支持',
    occupancy: 18,
    capacity: 30,
    temp: 23.5,
    humidity: 52,
    co2: 450,
    airQuality: 'good',
    alerts: [],
    color: '#DDA0DD'
  },
  {
    floor: '4F',
    name: '青少年中心',
    occupancy: 28,
    capacity: 40,
    temp: 22.8,
    humidity: 48,
    co2: 580,
    airQuality: 'good',
    alerts: [],
    color: '#87CEEB'
  }
];

// 健康通報統計
const healthReports = [
  { date: '10/17', fever: 0, respiratory: 1, gastrointestinal: 0, total: 1 },
  { date: '10/18', fever: 0, respiratory: 0, gastrointestinal: 0, total: 0 },
  { date: '10/19', fever: 1, respiratory: 2, gastrointestinal: 1, total: 4 },
  { date: '10/20', fever: 0, respiratory: 1, gastrointestinal: 0, total: 1 },
  { date: '10/21', fever: 0, respiratory: 0, gastrointestinal: 0, total: 0 },
  { date: '10/22', fever: 0, respiratory: 1, gastrointestinal: 0, total: 1 },
  { date: '10/23', fever: 2, respiratory: 3, gastrointestinal: 0, total: 5 }
];

// 感染風險評估
function InfectionRiskAssessment() {
  const totalCases = healthReports[healthReports.length - 1].total;
  const sevenDayAverage = healthReports.reduce((sum, day) => sum + day.total, 0) / 7;

  const getRiskLevel = () => {
    if (totalCases === 0) return { level: 'low', color: '#4caf50', text: '低風險' };
    if (totalCases <= 2) return { level: 'moderate', color: '#ff9800', text: '中風險' };
    return { level: 'high', color: '#f44336', text: '高風險' };
  };

  const risk = getRiskLevel();

  return (
    <div style={{
      padding: '25px',
      background: `linear-gradient(135deg, ${risk.color}22, ${risk.color}11)`,
      borderRadius: '15px',
      border: `3px solid ${risk.color}`
    }}>
      <h2 style={{ color: risk.color, marginBottom: '15px', fontSize: '22px' }}>
        🦠 即時感染風險評估
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>今日症狀通報</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: risk.color }}>
            {totalCases}例
          </div>
        </div>

        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>7日平均</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#666' }}>
            {sevenDayAverage.toFixed(1)}例
          </div>
        </div>

        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>風險等級</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: risk.color }}>
            {risk.text}
          </div>
        </div>
      </div>

      {/* 詳細分類 */}
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#667eea' }}>
          今日症狀分類
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          fontSize: '14px'
        }}>
          <div style={{
            padding: '12px',
            background: '#ffebee',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#c62828', fontWeight: 'bold' }}>
              🌡️ 發燒 {healthReports[6].fever}例
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#1565c0', fontWeight: 'bold' }}>
              😷 呼吸道 {healthReports[6].respiratory}例
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: '#e8f5e9',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>
              🤢 腸胃道 {healthReports[6].gastrointestinal}例
            </div>
          </div>
        </div>
      </div>

      {/* 應對措施 */}
      {totalCases > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '2px solid #ffc107',
          fontSize: '13px',
          lineHeight: '1.8'
        }}>
          <strong style={{ color: '#856404' }}>⚠️ 建議應對措施：</strong>
          <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0, color: '#856404' }}>
            {totalCases >= 3 && <li>啟動分區隔離措施（依CDC 2025指引）</li>}
            {healthReports[6].fever > 0 && <li>加強體溫監測頻率（每2小時1次）</li>}
            {healthReports[6].respiratory > 1 && <li>增加HEPA過濾頻率、紫外線消毒</li>}
            {totalCases > 0 && <li>通知家長、密切觀察接觸者、做好紀錄</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

// 環境監測指標卡片
function EnvironmentMetricCard({ title, value, unit, status, threshold, icon }) {
  const getStatusColor = () => {
    if (status === 'good') return '#4caf50';
    if (status === 'moderate') return '#ff9800';
    return '#f44336';
  };

  const statusColor = getStatusColor();

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      border: `3px solid ${statusColor}`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: statusColor, marginBottom: '8px' }}>
        {typeof value === 'number' ? value.toFixed(1) : value}{unit}
      </div>
      <div style={{
        padding: '6px 12px',
        background: statusColor + '22',
        borderRadius: '20px',
        fontSize: '12px',
        color: statusColor,
        fontWeight: 'bold',
        display: 'inline-block'
      }}>
        {status === 'good' ? '✅ 正常' : status === 'moderate' ? '⚠️ 注意' : '🚨 警示'}
      </div>
      {threshold && (
        <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
          建議值：{threshold}
        </div>
      )}
    </div>
  );
}

// 樓層狀態監控卡片
function FloorStatusCard({ floor }) {
  const occupancyRate = Math.round((floor.occupancy / floor.capacity) * 100);

  const getAirQualityText = (quality) => {
    if (quality === 'good') return { text: '優良', color: '#4caf50' };
    if (quality === 'moderate') return { text: '普通', color: '#ff9800' };
    return { text: '不良', color: '#f44336' };
  };

  const airQuality = getAirQualityText(floor.airQuality);

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      border: `3px solid ${floor.color}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#999' }}>{floor.floor}</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: floor.color }}>
            {floor.name}
          </div>
        </div>
        <div style={{
          padding: '8px 16px',
          background: airQuality.color,
          color: 'white',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          空氣{airQuality.text}
        </div>
      </div>

      {/* 使用率 */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px',
          fontSize: '13px'
        }}>
          <span>使用率</span>
          <span style={{ fontWeight: 'bold' }}>
            {floor.occupancy}/{floor.capacity}人 ({occupancyRate}%)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          background: '#e0e0e0',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${occupancyRate}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${floor.color}88, ${floor.color})`,
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* 環境指標 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '12px'
      }}>
        <div style={{
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: '#999' }}>溫度</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
            {floor.temp.toFixed(1)}°C
          </div>
        </div>
        <div style={{
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: '#999' }}>濕度</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
            {floor.humidity}%
          </div>
        </div>
        <div style={{
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: '#999' }}>CO₂</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: floor.co2 > 650 ? '#f44336' : '#4caf50' }}>
            {floor.co2}ppm
          </div>
        </div>
      </div>

      {/* 警示 */}
      {floor.alerts.length > 0 && (
        <div style={{
          padding: '10px',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '2px solid #ffc107'
        }}>
          {floor.alerts.map((alert, index) => (
            <div key={index} style={{ fontSize: '12px', color: '#856404' }}>
              ⚠️ {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 主儀表板
export function InfectionMonitoringDashboard() {
  const [realtimeData, setRealtimeData] = React.useState(generateMockData());
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  // 模擬即時更新（實際應使用WebSocket或輪詢API）
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(generateMockData());
      setLastUpdate(new Date());
    }, 30000); // 每30秒更新

    return () => clearInterval(interval);
  }, []);

  const latestData = realtimeData[realtimeData.length - 1];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
      {/* 標題與狀態 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              color: '#667eea',
              margin: '0 0 10px 0',
              fontSize: '28px'
            }}>
              🛡️ 感染監測儀表板
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              基於CDC 2025標準 | HEPA H13過濾 | 智慧通風系統
            </p>
          </div>
          <div style={{
            padding: '15px 25px',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>系統狀態</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>✅ 正常運作</div>
            <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.9 }}>
              更新時間：{lastUpdate.toLocaleTimeString('zh-TW')}
            </div>
          </div>
        </div>
      </div>

      {/* 感染風險評估 */}
      <div style={{ marginBottom: '30px' }}>
        <InfectionRiskAssessment />
      </div>

      {/* 環境監測指標 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '22px' }}>
          🌡️ 全館環境監測（即時）
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <EnvironmentMetricCard
            title="CO₂濃度"
            value={latestData.co2}
            unit="ppm"
            status={latestData.co2 < 650 ? 'good' : latestData.co2 < 800 ? 'moderate' : 'bad'}
            threshold="< 650ppm"
            icon="💨"
          />
          <EnvironmentMetricCard
            title="室內溫度"
            value={latestData.temp}
            unit="°C"
            status={latestData.temp >= 22 && latestData.temp <= 26 ? 'good' : 'moderate'}
            threshold="22-26°C"
            icon="🌡️"
          />
          <EnvironmentMetricCard
            title="相對濕度"
            value={latestData.humidity}
            unit="%"
            status={latestData.humidity >= 40 && latestData.humidity <= 60 ? 'good' : 'moderate'}
            threshold="40-60%"
            icon="💧"
          />
          <EnvironmentMetricCard
            title="PM2.5"
            value={latestData.pm25}
            unit="μg/m³"
            status={latestData.pm25 < 15 ? 'good' : latestData.pm25 < 35 ? 'moderate' : 'bad'}
            threshold="< 15μg/m³"
            icon="🫁"
          />
          <EnvironmentMetricCard
            title="換氣次數"
            value={latestData.airChanges}
            unit="ACH"
            status={latestData.airChanges >= 6 ? 'good' : 'moderate'}
            threshold="≥ 6 ACH"
            icon="🌀"
          />
          <EnvironmentMetricCard
            title="使用率"
            value={latestData.occupancy}
            unit="%"
            status={latestData.occupancy < 80 ? 'good' : 'moderate'}
            threshold="< 80%"
            icon="👥"
          />
        </div>

        {/* 24小時趨勢圖 */}
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#667eea' }}>
          📈 24小時趨勢
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={realtimeData}>
            <defs>
              <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'CO₂ (ppm)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: '溫度 (°C)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                padding: '10px'
              }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="co2" stroke="#667eea" strokeWidth={2} fillOpacity={1} fill="url(#colorCO2)" name="CO₂ (ppm)" />
            <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#ff6384" strokeWidth={2} dot={false} name="溫度 (°C)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 各樓層狀態 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '22px' }}>
          🏢 各樓層狀態監控
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {floorStatus.map(floor => (
            <FloorStatusCard key={floor.floor} floor={floor} />
          ))}
        </div>
      </div>

      {/* 7日症狀通報趨勢 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '22px' }}>
          📊 7日症狀通報趨勢
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={healthReports}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                padding: '10px'
              }}
            />
            <Legend />
            <Bar dataKey="fever" stackId="a" fill="#f44336" name="發燒" />
            <Bar dataKey="respiratory" stackId="a" fill="#2196f3" name="呼吸道症狀" />
            <Bar dataKey="gastrointestinal" stackId="a" fill="#4caf50" name="腸胃道症狀" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 感染控制措施 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '22px' }}>
          🛡️ 感染控制措施（CDC 2025標準）
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            background: '#e8f5e9',
            borderRadius: '12px',
            border: '2px solid #4caf50'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '12px', fontSize: '16px' }}>
              ✅ 空氣品質控制
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: '#333' }}>
              <li>HEPA H13過濾系統：過濾99.97% ≥0.3μm顆粒</li>
              <li>新風交換：每人每小時30 CMH</li>
              <li>換氣次數：6-8 ACH（符合CDC標準）</li>
              <li>紫外線消毒：夜間自動啟動（1F+2F）</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            background: '#e3f2fd',
            borderRadius: '12px',
            border: '2px solid #2196f3'
          }}>
            <h3 style={{ color: '#1565c0', marginBottom: '12px', fontSize: '16px' }}>
              🌡️ 健康監測
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: '#333' }}>
              <li>每日晨檢：額溫≥38°C立即隔離</li>
              <li>症狀APP通報：家長即時通知</li>
              <li>熱顯像儀：入口自動偵測體溫</li>
              <li>健康紀錄：雲端保存3年</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            background: '#fff3e0',
            borderRadius: '12px',
            border: '2px solid #ff9800'
          }}>
            <h3 style={{ color: '#e65100', marginBottom: '12px', fontSize: '16px' }}>
              🧼 清潔消毒
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8', color: '#333' }}>
              <li>高頻接觸面：每2小時消毒1次</li>
              <li>玩具教具：每日紫外線消毒</li>
              <li>餐具：高溫蒸氣消毒121°C、15分鐘</li>
              <li>地板：每日拖洗2次（1F、2F）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 操作說明 */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        💡 <strong>說明：</strong>本儀表板每30秒自動更新 | 數據來自各樓層感測器 | 異常自動發送警報至管理人員手機
      </div>
    </div>
  );
}

export default InfectionMonitoringDashboard;
