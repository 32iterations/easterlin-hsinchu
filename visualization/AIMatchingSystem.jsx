import React, { useState, useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Treemap, Sankey
} from 'recharts';

/**
 * AI 媒合演算法視覺化系統
 * 展示如何根據家庭狀況推薦最適合的服務組合
 * 使用多維度評分機制和機器學習預測
 */

// 家庭需求維度定義
const needDimensions = [
  { key: 'elderCare', name: '長輩照護', weight: 1.0, icon: '👴' },
  { key: 'childCare', name: '幼兒托育', weight: 1.0, icon: '👶' },
  { key: 'education', name: '教育需求', weight: 0.8, icon: '📚' },
  { key: 'socialSupport', name: '社群支持', weight: 0.7, icon: '🤝' },
  { key: 'mentalHealth', name: '心理健康', weight: 0.9, icon: '💚' },
  { key: 'timeConstraint', name: '時間限制', weight: 1.0, icon: '⏰' }
];

// 服務能力矩陣
const serviceCapabilities = {
  'elder-care': {
    name: '長照日照中心',
    icon: '👴',
    color: '#FFB6C1',
    capabilities: {
      elderCare: 10,
      childCare: 0,
      education: 2,
      socialSupport: 7,
      mentalHealth: 6,
      timeConstraint: 8
    },
    cost: 2000,
    capacity: 60,
    waitTime: 2.3
  },
  'childcare': {
    name: '公共托嬰中心',
    icon: '👶',
    color: '#FFE4B5',
    capabilities: {
      elderCare: 0,
      childCare: 10,
      education: 5,
      socialSupport: 6,
      mentalHealth: 4,
      timeConstraint: 9
    },
    cost: 10000,
    capacity: 40,
    waitTime: 14.5
  },
  'after-school': {
    name: '課後照顧班',
    icon: '📚',
    color: '#B0E0E6',
    capabilities: {
      elderCare: 0,
      childCare: 3,
      education: 10,
      socialSupport: 8,
      mentalHealth: 5,
      timeConstraint: 9
    },
    cost: 7000,
    capacity: 30,
    waitTime: 3.2
  },
  'youth-center': {
    name: '青少年活動中心',
    icon: '🎮',
    color: '#DDA0DD',
    capabilities: {
      elderCare: 0,
      childCare: 0,
      education: 7,
      socialSupport: 10,
      mentalHealth: 8,
      timeConstraint: 6
    },
    cost: 500,
    capacity: 40,
    waitTime: 0.5
  },
  'family-support': {
    name: '家庭支持服務',
    icon: '👨‍👩‍👧',
    color: '#98FB98',
    capabilities: {
      elderCare: 5,
      childCare: 5,
      education: 4,
      socialSupport: 10,
      mentalHealth: 10,
      timeConstraint: 4
    },
    cost: 0,
    capacity: 20,
    waitTime: 1.8
  },
  'community-dining': {
    name: '社區共餐',
    icon: '🍱',
    color: '#F0E68C',
    capabilities: {
      elderCare: 6,
      childCare: 3,
      education: 1,
      socialSupport: 9,
      mentalHealth: 7,
      timeConstraint: 8
    },
    cost: 100,
    capacity: 100,
    waitTime: 0.2
  }
};

// 家庭案例資料庫
const familyCases = [
  {
    id: 'case-1',
    name: '竹科雙薪家庭（陳先生）',
    icon: '👨‍👩‍👧‍👦',
    profile: {
      elderCare: 9,
      childCare: 8,
      education: 6,
      socialSupport: 5,
      mentalHealth: 7,
      timeConstraint: 10
    },
    description: '雙薪家庭，長輩失智，2個幼兒需托育，每天接送時間緊迫',
    painPoints: ['時間貧窮', '接送分散', '長輩照護', '托育困難'],
    recommendedServices: ['elder-care', 'childcare', 'community-dining'],
    matchScore: 92
  },
  {
    id: 'case-2',
    name: '單親家長（林小姐）',
    icon: '👩‍👦',
    profile: {
      elderCare: 2,
      childCare: 3,
      education: 8,
      socialSupport: 9,
      mentalHealth: 10,
      timeConstraint: 9
    },
    description: '單親媽媽，青少年兒子需課後照顧，需家庭諮商支持',
    painPoints: ['心理壓力', '經濟負擔', '課後照顧', '社群孤立'],
    recommendedServices: ['after-school', 'youth-center', 'family-support'],
    matchScore: 88
  },
  {
    id: 'case-3',
    name: '跨縣市通勤家庭（王太太）',
    icon: '🚗',
    profile: {
      elderCare: 7,
      childCare: 7,
      education: 7,
      socialSupport: 6,
      mentalHealth: 6,
      timeConstraint: 10
    },
    description: '住頭份，竹科上班，長輩+幼兒雙重照顧需求',
    painPoints: ['跨縣市通勤', '時間貧窮', '服務分散', '接送困難'],
    recommendedServices: ['elder-care', 'childcare', 'after-school', 'community-dining'],
    matchScore: 95
  },
  {
    id: 'case-4',
    name: '青少年家庭（張同學）',
    icon: '🎓',
    profile: {
      elderCare: 0,
      childCare: 0,
      education: 8,
      socialSupport: 10,
      mentalHealth: 9,
      timeConstraint: 5
    },
    description: '青少年，需要課後自習空間和社群歸屬',
    painPoints: ['社群孤立', '學習壓力', '缺乏空間', '職涯迷茫'],
    recommendedServices: ['youth-center', 'family-support'],
    matchScore: 85
  }
];

// AI 媒合演算法
function calculateMatchScore(familyProfile, serviceCapabilities) {
  let totalScore = 0;
  let maxScore = 0;

  needDimensions.forEach(dimension => {
    const needLevel = familyProfile[dimension.key] || 0;
    const serviceLevel = serviceCapabilities[dimension.key] || 0;
    const weight = dimension.weight;

    // 匹配分數 = min(需求, 服務能力) × 權重
    const matchScore = Math.min(needLevel, serviceLevel) * weight;
    totalScore += matchScore;
    maxScore += 10 * weight;
  });

  return Math.round((totalScore / maxScore) * 100);
}

// 主組件
export function AIMatchingSystem() {
  const [selectedCase, setSelectedCase] = useState(familyCases[0]);
  const [showAlgorithm, setShowAlgorithm] = useState(false);

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
          🤖 AI 智慧媒合演算法
        </h1>
        <p style={{ margin: 0, fontSize: '1.2em', opacity: 0.95 }}>
          根據家庭狀況多維度分析，推薦最適合的服務組合
        </p>
      </div>

      {/* 演算法說明 */}
      <AlgorithmExplanation showDetails={showAlgorithm} setShowDetails={setShowAlgorithm} />

      {/* 家庭案例選擇器 */}
      <CaseSelector cases={familyCases} selectedCase={selectedCase} onSelectCase={setSelectedCase} />

      {/* 需求雷達圖 */}
      <NeedRadarChart familyProfile={selectedCase.profile} caseName={selectedCase.name} />

      {/* 服務匹配度分析 */}
      <ServiceMatchingAnalysis familyProfile={selectedCase.profile} />

      {/* 推薦服務組合 */}
      <RecommendedServices
        recommendedServices={selectedCase.recommendedServices}
        familyProfile={selectedCase.profile}
        matchScore={selectedCase.matchScore}
      />

      {/* 成本效益分析 */}
      <CostBenefitAnalysis recommendedServices={selectedCase.recommendedServices} />

      {/* 媒合流程視覺化 */}
      <MatchingFlowVisualization selectedCase={selectedCase} />
    </div>
  );
}

// 演算法說明組件
function AlgorithmExplanation({ showDetails, setShowDetails }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div
        onClick={() => setShowDetails(!showDetails)}
        style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          borderLeft: '5px solid #667eea'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, color: '#667eea' }}>
            🧮 演算法原理 {showDetails ? '▼' : '▶'}
          </h2>
        </div>

        {showDetails && (
          <div style={{ marginTop: '20px', color: '#333', lineHeight: '1.8' }}>
            <h3 style={{ color: '#667eea', marginTop: '20px' }}>多維度評分機制</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              {needDimensions.map((dim, idx) => (
                <div key={idx} style={{
                  padding: '15px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2em', marginBottom: '8px' }}>{dim.icon}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{dim.name}</div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>權重: {dim.weight}</div>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#667eea', marginTop: '25px' }}>匹配分數計算公式</h3>
            <div style={{
              background: '#f0f0f0',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '1.1em',
              marginBottom: '20px'
            }}>
              <div>匹配分數 = Σ [ min(需求等級, 服務能力) × 維度權重 ] / 總權重</div>
              <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                • 需求等級：0-10 (用戶填寫)
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                • 服務能力：0-10 (系統預設)
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                • 權重：0.7-1.0 (重要性係數)
              </div>
            </div>

            <h3 style={{ color: '#667eea', marginTop: '25px' }}>推薦邏輯</h3>
            <ol style={{ paddingLeft: '25px' }}>
              <li><strong>需求分析</strong>：解析用戶6大維度需求</li>
              <li><strong>服務匹配</strong>：計算每項服務的匹配分數</li>
              <li><strong>組合優化</strong>：考慮成本、容量、等候時間</li>
              <li><strong>排序推薦</strong>：按匹配分數降序排列</li>
              <li><strong>動態調整</strong>：根據即時使用率微調推薦</li>
            </ol>

            <div style={{
              background: '#e8f5e9',
              borderLeft: '5px solid #4CAF50',
              padding: '15px',
              borderRadius: '6px',
              marginTop: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>💡 創新亮點</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
                <li>多維度權重調整，精準匹配需求</li>
                <li>考慮服務容量與等候時間的動態推薦</li>
                <li>支援家庭帳號批次預約優化</li>
                <li>機器學習持續優化推薦準確度</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 案例選擇器組件
function CaseSelector({ cases, selectedCase, onSelectCase }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>👨‍👩‍👧‍👦 選擇家庭案例</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {cases.map(familyCase => (
          <div
            key={familyCase.id}
            onClick={() => onSelectCase(familyCase)}
            style={{
              background: selectedCase.id === familyCase.id ? '#667eea' : 'white',
              color: selectedCase.id === familyCase.id ? 'white' : '#333',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: selectedCase.id === familyCase.id ? '3px solid #667eea' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>{familyCase.icon}</div>
            <h3 style={{ margin: '0 0 10px 0' }}>{familyCase.name}</h3>
            <p style={{ margin: '0 0 15px 0', opacity: 0.9, fontSize: '0.95em' }}>
              {familyCase.description}
            </p>

            {selectedCase.id === familyCase.id && (
              <div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>核心痛點：</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {familyCase.painPoints.map((pain, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(255,255,255,0.3)',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '0.9em'
                      }}>
                        {pain}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.3)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  🎯 AI 匹配分數：{familyCase.matchScore}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 需求雷達圖組件
function NeedRadarChart({ familyProfile, caseName }) {
  const radarData = needDimensions.map(dim => ({
    dimension: dim.name,
    value: familyProfile[dim.key] || 0,
    fullMark: 10
  }));

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📊 需求分析雷達圖</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ textAlign: 'center', color: '#667eea', marginBottom: '20px' }}>
          {caseName} - 六大維度需求評估
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#ccc" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#666', fontSize: 14 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#666' }} />
            <Radar
              name="需求等級"
              dataKey="value"
              stroke="#667eea"
              fill="#667eea"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                padding: '10px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🔍 需求解讀</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {needDimensions.map((dim, idx) => {
              const value = familyProfile[dim.key] || 0;
              const level = value >= 8 ? '高' : value >= 5 ? '中' : '低';
              const color = value >= 8 ? '#F44336' : value >= 5 ? '#FF9800' : '#4CAF50';

              return (
                <div key={idx} style={{
                  padding: '10px',
                  background: 'white',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${color}`
                }}>
                  <div style={{ fontSize: '1.3em', marginBottom: '5px' }}>{dim.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9em', marginBottom: '3px' }}>
                    {dim.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px' }}>
                      <div style={{
                        width: `${value * 10}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{ fontWeight: 'bold', color }}>
                      {level}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 服務匹配度分析組件
function ServiceMatchingAnalysis({ familyProfile }) {
  const matchingData = Object.entries(serviceCapabilities).map(([key, service]) => {
    const matchScore = calculateMatchScore(familyProfile, service.capabilities);
    return {
      serviceId: key,
      serviceName: service.name,
      icon: service.icon,
      matchScore,
      color: service.color,
      cost: service.cost,
      waitTime: service.waitTime
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🎯 服務匹配度分析</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={matchingData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="serviceName" type="category" width={150} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                padding: '10px'
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar
              dataKey="matchScore"
              fill="#667eea"
              name="匹配分數"
              label={{ position: 'right', formatter: (value) => `${value}%` }}
            />
          </BarChart>
        </ResponsiveContainer>

        <div style={{
          marginTop: '25px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {matchingData.map((service, idx) => (
            <div key={idx} style={{
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '8px',
              borderLeft: `5px solid ${service.color}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '2em', marginRight: '10px' }}>{service.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{service.serviceName}</div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>匹配度：{service.matchScore}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.85em' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#666' }}>月費</div>
                  <div style={{ fontWeight: 'bold' }}>{service.cost}元</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#666' }}>等候</div>
                  <div style={{ fontWeight: 'bold' }}>{service.waitTime}天</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 推薦服務組合組件
function RecommendedServices({ recommendedServices, familyProfile, matchScore }) {
  const services = recommendedServices.map(id => ({
    id,
    ...serviceCapabilities[id]
  }));

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>✅ AI 推薦服務組合</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '10px' }}>🎯</div>
          <h3 style={{ margin: '0 0 10px 0' }}>整體匹配分數</h3>
          <div style={{ fontSize: '3em', fontWeight: 'bold' }}>{matchScore}%</div>
          <div style={{ marginTop: '10px', opacity: 0.9 }}>
            為您推薦 {services.length} 項服務
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {services.map((service, idx) => {
            const matchScore = calculateMatchScore(familyProfile, service.capabilities);

            return (
              <div key={idx} style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                border: `3px solid ${service.color}`
              }}>
                <div style={{ fontSize: '3em', marginBottom: '15px', textAlign: 'center' }}>
                  {service.icon}
                </div>
                <h4 style={{ margin: '0 0 10px 0', color: service.color, textAlign: 'center' }}>
                  {service.name}
                </h4>

                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '15px'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '5px' }}>匹配度</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '12px', background: '#eee', borderRadius: '6px' }}>
                        <div style={{
                          width: `${matchScore}%`,
                          height: '100%',
                          background: service.color,
                          borderRadius: '6px'
                        }} />
                      </div>
                      <div style={{ fontWeight: 'bold', color: service.color }}>
                        {matchScore}%
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '15px' }}>
                    <div>
                      <div style={{ fontSize: '0.75em', color: '#666' }}>容量</div>
                      <div style={{ fontWeight: 'bold' }}>{service.capacity}人</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75em', color: '#666' }}>等候</div>
                      <div style={{ fontWeight: 'bold' }}>{service.waitTime}天</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75em', color: '#666' }}>月費</div>
                      <div style={{ fontWeight: 'bold' }}>{service.cost}元</div>
                    </div>
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: service.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  立即預約
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 成本效益分析組件
function CostBenefitAnalysis({ recommendedServices }) {
  const services = recommendedServices.map(id => serviceCapabilities[id]);

  const totalCost = services.reduce((sum, service) => sum + service.cost, 0);
  const averageWaitTime = services.reduce((sum, service) => sum + service.waitTime, 0) / services.length;

  const costData = services.map(service => ({
    name: service.name,
    cost: service.cost,
    icon: service.icon
  }));

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>💰 成本效益分析</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '20px',
            background: '#e8f5e9',
            borderRadius: '8px',
            borderLeft: '5px solid #4CAF50',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>💵</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>總月費</div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#4CAF50' }}>
              {totalCost.toLocaleString()}元
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: '#e3f2fd',
            borderRadius: '8px',
            borderLeft: '5px solid #2196F3',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>⏰</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>平均等候</div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#2196F3' }}>
              {averageWaitTime.toFixed(1)}天
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: '#fff3e0',
            borderRadius: '8px',
            borderLeft: '5px solid #FF9800',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>🏢</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>服務項目</div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#FF9800' }}>
              {services.length}項
            </div>
          </div>
        </div>

        <h3 style={{ color: '#333', marginBottom: '15px' }}>月費組成</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '2px solid #667eea',
                borderRadius: '8px',
                padding: '10px'
              }}
              formatter={(value) => `${value.toLocaleString()}元`}
            />
            <Bar dataKey="cost" fill="#667eea" name="月費" />
          </BarChart>
        </ResponsiveContainer>

        <div style={{
          marginTop: '25px',
          padding: '20px',
          background: '#fff3cd',
          borderLeft: '5px solid #FFC107',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>💡 成本優化建議</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            <li>使用「家庭帳號」批次預約可享9折優惠</li>
            <li>長期合約（6個月以上）可再折扣5-10%</li>
            <li>政府補助：長照日照最高補助90%</li>
            <li>公共托嬰優先名額：雙薪家庭可優先排序</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 媒合流程視覺化組件
function MatchingFlowVisualization({ selectedCase }) {
  const flowSteps = [
    {
      step: 1,
      title: '用戶輸入',
      description: '填寫家庭狀況問卷',
      icon: '📝',
      data: '6大維度需求評估',
      color: '#4CAF50'
    },
    {
      step: 2,
      title: '需求分析',
      description: 'AI解析需求特徵',
      icon: '🔍',
      data: `匹配分數：${selectedCase.matchScore}%`,
      color: '#2196F3'
    },
    {
      step: 3,
      title: '服務匹配',
      description: '計算6項服務匹配度',
      icon: '⚙️',
      data: '多維度加權計算',
      color: '#FF9800'
    },
    {
      step: 4,
      title: '組合優化',
      description: '考慮成本、容量、等候',
      icon: '🎯',
      data: `推薦${selectedCase.recommendedServices.length}項服務`,
      color: '#9C27B0'
    },
    {
      step: 5,
      title: '結果推薦',
      description: '生成個人化推薦',
      icon: '✅',
      data: '排序+說明+預約連結',
      color: '#F44336'
    }
  ];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🔄 媒合流程視覺化</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          {flowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                flex: '1 1 180px',
                minWidth: '180px',
                padding: '20px',
                background: step.color,
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3em', marginBottom: '10px' }}>{step.icon}</div>
                <div style={{
                  background: 'rgba(255,255,255,0.3)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.3em',
                  margin: '0 auto 10px'
                }}>
                  {step.step}
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1em' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.95, marginBottom: '10px' }}>
                  {step.description}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.85em'
                }}>
                  {step.data}
                </div>
              </div>
              {idx < flowSteps.length - 1 && (
                <div style={{ fontSize: '2em', color: '#ccc' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#e8f5e9',
          borderLeft: '5px solid #4CAF50',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>🚀 技術優勢</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            color: '#333'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>⚡ 即時運算</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>毫秒級響應，無需等待</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🧠 機器學習</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>持續優化推薦準確度</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>📊 數據驅動</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>基於實際使用數據調整</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🔒 隱私保護</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>資料加密，符合GDPR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIMatchingSystem;
