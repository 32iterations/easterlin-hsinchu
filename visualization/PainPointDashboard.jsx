import React from 'react';
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  Label
} from 'recharts';

/**
 * 竹科家庭痛點分析 - React視覺化組件套件
 * 114年新竹政策黑客松 - 赤土崎全齡社福樞紐提案
 *
 * 基於實際數據：
 * - 11篇高品質文章分析
 * - 5年時間跨度（2021-2025）
 * - 6維度痛點分類
 */

// ==================== 數據配置 ====================

// 痛點優先級矩陣數據（基於pain_point_matrix.csv）
const priorityMatrixData = [
  {
    name: '時間類',
    category: '時間類',
    impact: 54.5,        // 影響廣度（%）
    intensity: 3.0,      // 痛點深度（1-3分）
    priority: 4.91,      // 優先級分數
    color: '#ff6384',
    size: 800,
    examples: ['接送疲勞', '通勤耗時', '等待時間']
  },
  {
    name: '關係類',
    category: '關係類',
    impact: 36.4,
    intensity: 2.5,
    priority: 2.28,
    color: '#ffcd56',
    size: 600,
    examples: ['隔代教養', '親子疏離', '社群壓力']
  },
  {
    name: '健康類',
    category: '健康類',
    impact: 9.1,
    intensity: 2.0,
    priority: 0.55,
    color: '#4bc0c0',
    size: 400,
    examples: ['慢性病', '心理健康', '過勞']
  },
  {
    name: '資源類',
    category: '資源類',
    impact: 9.1,
    intensity: 1.5,
    priority: 0.41,
    color: '#36a2eb',
    size: 400,
    examples: ['服務分散', '資訊不足', '可近性低']
  },
  {
    name: '心理類',
    category: '心理類',
    impact: 0,
    intensity: 1.0,
    priority: 0,
    color: '#9966ff',
    size: 200,
    examples: []
  },
  {
    name: '金錢類',
    category: '金錢類',
    impact: 0,
    intensity: 0,
    priority: 0,
    color: '#c9cbcf',
    size: 200,
    examples: []
  }
];

// 痛點類別分布數據
const painPointDistributionData = [
  { category: '時間類', frequency: 54.5, articles: 6, color: '#ff6384' },
  { category: '關係類', frequency: 36.4, articles: 4, color: '#ffcd56' },
  { category: '健康類', frequency: 9.1, articles: 1, color: '#4bc0c0' },
  { category: '資源類', frequency: 9.1, articles: 1, color: '#36a2eb' },
  { category: '心理類', frequency: 0, articles: 0, color: '#9966ff' },
  { category: '金錢類', frequency: 0, articles: 0, color: '#c9cbcf' }
];

// 服務缺口對比數據
const serviceGapData = [
  {
    service: 'C級長照站',
    supply: 9,
    gap: 91,
    demand: 196,
    current: 18
  },
  {
    service: '日照中心',
    supply: 18.5,
    gap: 81.5,
    demand: 352,
    current: 65
  },
  {
    service: '公共托嬰',
    supply: 0,
    gap: 100,
    demand: 3300,
    current: 0
  },
  {
    service: '青少年中心',
    supply: 0,
    gap: 100,
    demand: 1,
    current: 0
  }
];

// 主題覆蓋率數據
const topicCoverageData = [
  { topic: '工作-家庭平衡', coverage: 100 },
  { topic: '托育/教育壓力', coverage: 54.5 },
  { topic: '社群焦慮/教養競爭', coverage: 36.4 },
  { topic: '心理健康', coverage: 27.3 },
  { topic: '時間貧窮', coverage: 18.2 },
  { topic: '長照/失智照護', coverage: 9.1 }
];

// 情緒分數分布數據
const emotionDistributionData = [
  { emotion: '中性 (0.0)', value: 72.7, color: '#c9cbcf' },
  { emotion: '負面 (-0.1~-0.3)', value: 18.2, color: '#ff6384' },
  { emotion: '正面 (+0.5)', value: 9.1, color: '#4bc0c0' }
];

// 議題熱度時間軸數據
const timelineData = [
  { year: '2021', articles: 1, event: '竹科媽媽群組爭議' },
  { year: '2022', articles: 2, event: '新竹5缺點討論' },
  { year: '2023', articles: 0, event: '-' },
  { year: '2024', articles: 0, event: '-' },
  { year: '2025', articles: 8, event: '年薪300萬貧戶熱議' }
];

// ==================== 組件定義 ====================

/**
 * 1. 痛點優先級矩陣（散點圖）
 * X軸：影響廣度（受影響家庭比例%）
 * Y軸：痛點深度（平均強度1-3分）
 * 泡泡大小：優先級分數
 */
export const PainPointPriorityMatrix = ({ width = 700, height = 500 }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'white',
          padding: '15px',
          border: '2px solid #667eea',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            {data.name}
          </p>
          <p style={{ margin: '4px 0', color: '#666' }}>
            影響廣度: {data.impact}% 家庭
          </p>
          <p style={{ margin: '4px 0', color: '#666' }}>
            痛點深度: {data.intensity}/3.0
          </p>
          <p style={{ margin: '4px 0', color: '#667eea', fontWeight: 'bold' }}>
            優先級分數: {data.priority}
          </p>
          {data.examples.length > 0 && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
              例：{data.examples.join('、')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        🎯 痛點優先級矩陣：影響廣度 × 痛點深度
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        右上象限 = 高優先級 | 泡泡大小 = 優先級分數
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey="impact"
            name="影響廣度"
            domain={[0, 60]}
            label={{
              value: '影響廣度（受影響家庭比例 %）',
              position: 'bottom',
              offset: 40,
              style: { fontWeight: 'bold', fontSize: 14 }
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="intensity"
            name="痛點深度"
            domain={[0, 3.5]}
            label={{
              value: '痛點深度（平均強度 1-3分）',
              angle: -90,
              position: 'left',
              offset: 40,
              style: { fontWeight: 'bold', fontSize: 14 }
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="痛點類別"
            data={priorityMatrixData}
            fill="#8884d8"
          >
            {priorityMatrixData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
          {/* 優先級分界線 */}
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#ff6384" strokeDasharray="5 5" />
          <line x1="0" y1="66%" x2="100%" y2="66%" stroke="#ff6384" strokeDasharray="5 5" />
        </ScatterChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '15px',
        flexWrap: 'wrap'
      }}>
        {priorityMatrixData.slice(0, 4).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: item.color,
              borderRadius: '50%'
            }} />
            <span style={{ fontSize: '13px', color: '#666' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 2. 痛點類別分布（橫條圖）
 */
export const PainPointDistribution = ({ width = 600, height = 400 }) => {
  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        📊 痛點類別分布
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        時間類痛點占 54.5%，遠超其他類別
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={painPointDistributionData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            domain={[0, 60]}
            label={{ value: '出現頻率 (%)', position: 'bottom', offset: 0 }}
          />
          <YAxis type="category" dataKey="category" width={80} />
          <Tooltip
            formatter={(value, name) => [`${value}%`, '頻率']}
            labelFormatter={(label) => `類別：${label}`}
          />
          <Bar dataKey="frequency" radius={[0, 8, 8, 0]}>
            {painPointDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
        borderLeft: '4px solid #667eea'
      }}>
        <h4 style={{ color: '#667eea', margin: '0 0 8px 0', fontSize: '14px' }}>💡 關鍵洞察</h4>
        <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
          時間類痛點占54.5%，遠超其他類別。竹科家庭的核心問題是「服務分散」導致的時間貧窮，
          而非財務困難（金錢類痛點0%）。
        </p>
      </div>
    </div>
  );
};

/**
 * 3. 服務缺口對比（堆疊條形圖）
 */
export const ServiceGapComparison = ({ width = 600, height = 400 }) => {
  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        🏢 服務缺口對比
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        公共托嬰與C級長照站缺口最嚴重（91-100%）
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={serviceGapData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            domain={[0, 100]}
            label={{ value: '百分比 (%)', position: 'bottom', offset: 0 }}
          />
          <YAxis type="category" dataKey="service" width={100} />
          <Tooltip
            formatter={(value) => `${value}%`}
            labelFormatter={(label) => `服務：${label}`}
          />
          <Legend />
          <Bar dataKey="supply" stackId="a" fill="#4bc0c0" name="現有供給" />
          <Bar dataKey="gap" stackId="a" fill="#ff6384" name="缺口" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
        borderLeft: '4px solid #667eea'
      }}>
        <h4 style={{ color: '#667eea', margin: '0 0 8px 0', fontSize: '14px' }}>💡 關鍵洞察</h4>
        <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
          公共托嬰中心（100%缺口）與C級長照站（91%缺口）為最嚴重缺口。
          赤土崎多功能館可優先整合這兩大功能，創造「1+1&gt;2」綜效。
        </p>
      </div>
    </div>
  );
};

/**
 * 4. 主題覆蓋率（雷達圖）
 */
export const TopicCoverageRadar = ({ width = 600, height = 450 }) => {
  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        📈 主題覆蓋率（多選）
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        工作-家庭平衡議題 100% 覆蓋
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={topicCoverageData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="topic"
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
          />
          <Radar
            name="覆蓋率"
            dataKey="coverage"
            stroke="#667eea"
            fill="#667eea"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              background: 'white',
              border: '2px solid #667eea',
              borderRadius: '8px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
        borderLeft: '4px solid #667eea'
      }}>
        <h4 style={{ color: '#667eea', margin: '0 0 8px 0', fontSize: '14px' }}>💡 關鍵洞察</h4>
        <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
          工作-家庭平衡議題100%覆蓋，托育壓力（54.5%）與社群焦慮（36.4%）為次要議題。
          長照議題僅9.1%，顯示資料樣本以雙薪家庭為主。
        </p>
      </div>
    </div>
  );
};

/**
 * 5. 情緒分數分布（圓餅圖）
 */
export const EmotionDistributionPie = ({ width = 600, height = 400 }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        😊 情緒分數分布
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        18.2% 文章呈現負面情緒
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={emotionDistributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            dataKey="value"
          >
            {emotionDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
        borderLeft: '4px solid #667eea'
      }}>
        <h4 style={{ color: '#667eea', margin: '0 0 8px 0', fontSize: '14px' }}>💡 關鍵洞察</h4>
        <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
          18.2%文章呈現負面情緒（-0.1以下），反映竹科家庭真實壓力。
          大部分文章保持中立報導，增加數據可信度。
        </p>
      </div>
    </div>
  );
};

/**
 * 6. 議題熱度時間軸（折線圖）
 */
export const TimelineChart = ({ width = 800, height = 400 }) => {
  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>
        📅 議題熱度時間軸
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        2025年討論熱度激增（8篇文章）
      </p>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={timelineData}
          margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            label={{
              value: '年份',
              position: 'bottom',
              offset: 20
            }}
          />
          <YAxis
            label={{
              value: '文章數量',
              angle: -90,
              position: 'insideLeft'
            }}
            domain={[0, 10]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div style={{
                    background: 'white',
                    padding: '12px',
                    border: '2px solid #667eea',
                    borderRadius: '8px'
                  }}>
                    <p style={{ margin: '0 0 6px 0', fontWeight: 'bold' }}>
                      {data.year}年
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#666' }}>
                      文章數：{data.articles}篇
                    </p>
                    <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                      {data.event}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="articles"
            stroke="#667eea"
            strokeWidth={3}
            dot={{ fill: '#667eea', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
        borderLeft: '4px solid #667eea'
      }}>
        <h4 style={{ color: '#667eea', margin: '0 0 8px 0', fontSize: '14px' }}>💡 關鍵洞察</h4>
        <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
          2022年「竹科5缺點」引發討論，2025年「年薪300萬貧戶」再掀熱潮。
          議題持續發酵5年未解決，顯示政策介入的迫切性與正當性。
        </p>
      </div>
    </div>
  );
};

/**
 * 7. 完整儀表板（整合所有圖表）
 */
export const CompleteDashboard = () => {
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', 'Microsoft JhengHei', sans-serif"
    }}>
      {/* 標題區 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '15px',
        marginBottom: '40px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0' }}>
          🎯 竹科家庭痛點分析儀表板
        </h1>
        <p style={{ fontSize: '1.2em', margin: '0 0 10px 0', opacity: 0.95 }}>
          114年新竹政策黑客松 - 赤土崎全齡社福樞紐提案
        </p>
        <p style={{ fontSize: '0.9em', margin: 0, opacity: 0.85 }}>
          數據來源：19篇文章去重後11篇 | 時間跨度：2021-2025 | 更新日期：2025-10-22
        </p>
      </div>

      {/* 關鍵指標卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.9em', marginBottom: '10px', opacity: 0.9 }}>
            核心洞察
          </div>
          <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '10px 0' }}>
            54.5%
          </div>
          <div style={{ fontSize: '0.95em', opacity: 0.9 }}>
            痛點來自「時間貧窮」而非金錢
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.9em', color: '#999', marginBottom: '10px' }}>
            工作-家庭平衡
          </div>
          <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
            100%
          </div>
          <div style={{ fontSize: '0.95em', color: '#666' }}>
            所有文章涉及此主題
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.9em', color: '#999', marginBottom: '10px' }}>
            服務缺口
          </div>
          <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
            81.5%
          </div>
          <div style={{ fontSize: '0.95em', color: '#666' }}>
            日照中心供需缺口
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.9em', color: '#999', marginBottom: '10px' }}>
            標案金額
          </div>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>
            2,287萬
          </div>
          <div style={{ fontSize: '0.95em', color: '#666' }}>
            赤土崎多功能館規劃設計
          </div>
        </div>
      </div>

      {/* 圖表區 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
        gap: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <PainPointDistribution />
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <EmotionDistributionPie />
        </div>

        <div style={{
          gridColumn: '1 / -1',
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <PainPointPriorityMatrix height={550} />
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <TopicCoverageRadar />
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <ServiceGapComparison />
        </div>

        <div style={{
          gridColumn: '1 / -1',
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <TimelineChart />
        </div>
      </div>

      {/* 頁尾 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginTop: '40px',
        textAlign: 'center',
        color: '#666',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
          <strong>資料處理：</strong>6階段增強管道 | 去重率：42% (19→11篇) | 政策對接：100%
        </p>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
          <strong>標案時機：</strong>114A109標案10/30開標，設計階段（11-12月）為納入整合功能的黃金窗口 🔥
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
          生成時間：2025-10-22 | Claude Code + React Visualization Suite
        </p>
      </div>
    </div>
  );
};

export default CompleteDashboard;
