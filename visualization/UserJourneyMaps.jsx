import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

/**
 * 用戶旅程地圖 - 3種Persona
 * 展示竹科家庭不同需求族群如何使用赤土崎全齡社福樞紐
 */

// Persona 1: 竹科雙薪家庭
const persona1Data = {
  id: 'dual-income',
  name: '王先生/王太太',
  title: '竹科雙薪家庭',
  demographics: {
    age: '38/36歲',
    occupation: '竹科工程師/產品經理',
    family: '4人家庭（父母+1歲女兒+75歲失智母親）',
    income: '年收入350萬',
    location: '住竹北、上班竹科'
  },
  needs: [
    '1歲女兒需要托育（公托排不到）',
    '75歲失智母親需要日間照顧',
    '每天通勤時間過長（2小時接送）',
    '工作壓力大、家庭時間不足'
  ],
  journey: [
    {
      time: '07:00',
      hour: 7,
      activity: '出門前準備',
      touchpoint: '家中',
      satisfaction: 2,
      description: '叫醒母親、準備女兒早餐、自己趕著化妝',
      emotion: '😫 焦躁',
      painPoints: ['時間緊迫', '三代同時準備']
    },
    {
      time: '07:30',
      hour: 7.5,
      activity: '開車前往赤土崎',
      touchpoint: 'B1停車場',
      satisfaction: 4,
      description: 'B1停車場有親子優先車位，靠近電梯',
      emotion: '😊 方便',
      delights: ['一站式接送', '停車方便']
    },
    {
      time: '08:00',
      hour: 8,
      activity: '同時送托',
      touchpoint: '1F日照 + 2F托嬰',
      satisfaction: 5,
      description: '電梯直達各樓層，母親1F日照、女兒2F托嬰',
      emotion: '🎉 滿意',
      delights: ['同棟建築', '節省30分鐘', '護理師晨檢']
    },
    {
      time: '08:30',
      hour: 8.5,
      activity: '前往竹科上班',
      touchpoint: '通勤',
      satisfaction: 4,
      description: '比以前減少1小時接送時間',
      emotion: '😌 輕鬆',
      delights: ['通勤時間縮短']
    },
    {
      time: '12:00',
      hour: 12,
      activity: '工作時間',
      touchpoint: 'APP查看',
      satisfaction: 4,
      description: '透過APP看到女兒午睡照片、母親吃飯照片',
      emotion: '🥰 安心',
      delights: ['即時照片', '透明安心']
    },
    {
      time: '17:00',
      hour: 17,
      activity: '下班前往接送',
      touchpoint: 'B1停車場',
      satisfaction: 4,
      description: '停車場不塞車，分流電梯設計',
      emotion: '😊 順暢',
      delights: ['接送動線順暢']
    },
    {
      time: '17:30',
      hour: 17.5,
      activity: '女兒轉課後照顧',
      touchpoint: '2F→3F',
      satisfaction: 5,
      description: '女兒可留在2F或轉3F課後照顧（到19:00）',
      emotion: '🎉 彈性',
      delights: ['延長照顧', '彈性時間']
    },
    {
      time: '18:00',
      hour: 18,
      activity: '參加親職講座',
      touchpoint: '3F多功能教室',
      satisfaction: 5,
      description: '等待接女兒的時間，參加「幼兒睡眠訓練」講座',
      emotion: '📚 充實',
      delights: ['等待時間有意義', '學習育兒知識']
    },
    {
      time: '18:30',
      hour: 18.5,
      activity: '全家共進晚餐',
      touchpoint: '3F社區共餐',
      satisfaction: 5,
      description: '帶母親和女兒在3F共餐廚房吃晚餐（80元/人）',
      emotion: '🍽️ 溫馨',
      delights: ['不用煮飯', '家庭時間', '營養均衡']
    },
    {
      time: '19:00',
      hour: 19,
      activity: '返家',
      touchpoint: 'B1停車場',
      satisfaction: 5,
      description: '一整天的需求都在一棟建築內解決',
      emotion: '😌 滿足',
      delights: ['省時省力', '家庭時間增加2小時']
    }
  ],
  summary: {
    timeSaved: '每日節省2小時接送時間',
    moneySaved: '每月省下私托差價1.5萬元',
    satisfactionScore: '9/10',
    keyBenefit: '一站式整合服務，工作家庭平衡改善'
  }
};

// Persona 2: 單親家長
const persona2Data = {
  id: 'single-parent',
  name: '林小姐',
  title: '單親家長',
  demographics: {
    age: '42歲',
    occupation: '竹科作業員（輪班制）',
    family: '2人家庭（自己+12歲兒子）',
    income: '年收入80萬',
    location: '住新竹市東區（租屋）'
  },
  needs: [
    '12歲兒子需要課後照顧（下課後無人照顧）',
    '輪班工作，接送時間不固定',
    '經濟壓力大，需要低收入戶補助',
    '缺乏家庭支持系統，需要諮商服務'
  ],
  journey: [
    {
      time: '14:00',
      hour: 14,
      activity: '兒子下課',
      touchpoint: '學校→赤土崎',
      satisfaction: 3,
      description: '兒子自己搭公車前往赤土崎（媽媽還在上班）',
      emotion: '😐 普通',
      painPoints: ['無法親自接送', '擔心安全']
    },
    {
      time: '14:30',
      hour: 14.5,
      activity: '抵達青少年中心',
      touchpoint: '4F自習室',
      satisfaction: 4,
      description: '刷學生卡進入，前往自習室寫作業',
      emotion: '📖 專注',
      delights: ['安全環境', '免費自習室']
    },
    {
      time: '16:00',
      hour: 16,
      activity: '完成作業後',
      touchpoint: '4F交誼廳',
      satisfaction: 4,
      description: '和同學玩桌遊、Switch（有輔導員陪伴）',
      emotion: '😊 開心',
      delights: ['同儕互動', '有大人照看']
    },
    {
      time: '17:30',
      hour: 17.5,
      activity: '晚餐時間',
      touchpoint: '3F社區共餐',
      satisfaction: 5,
      description: '低收入戶免費供餐，營養均衡（志工阿姨很親切）',
      emotion: '🍽️ 溫暖',
      delights: ['免費晚餐', '像家一樣']
    },
    {
      time: '18:00',
      hour: 18,
      activity: '媽媽下班抵達',
      touchpoint: '4F青少年中心',
      satisfaction: 4,
      description: '媽媽下班後來接兒子',
      emotion: '😊 安心',
      delights: ['兒子安全', '有人照顧']
    },
    {
      time: '18:30',
      hour: 18.5,
      activity: '母子家庭諮商',
      touchpoint: '3F諮商室',
      satisfaction: 5,
      description: '預約家庭諮商（低收戶免費），改善親子溝通',
      emotion: '💬 釋放',
      delights: ['專業支持', '情緒出口', '免費服務']
    },
    {
      time: '19:30',
      hour: 19.5,
      activity: '返家',
      touchpoint: '公車站',
      satisfaction: 4,
      description: '母子一起搭公車回家（赤土崎在公車路線上）',
      emotion: '😌 平靜',
      delights: ['親子時間', '不用擔心晚餐']
    }
  ],
  summary: {
    timeSaved: '每月省下課後安親班費用8000元',
    moneySaved: '免費晚餐、諮商服務，每月省1.2萬元',
    satisfactionScore: '8/10',
    keyBenefit: '弱勢家庭支持系統，降低單親壓力'
  }
};

// Persona 3: 青少年
const persona3Data = {
  id: 'teenager',
  name: '陳同學',
  title: '國中生',
  demographics: {
    age: '14歲',
    occupation: '國中二年級學生',
    family: '4人家庭（父母雙薪+妹妹）',
    interests: '程式設計、樂團、桌遊',
    challenges: '課業壓力、社交焦慮、職涯迷惘'
  },
  needs: [
    '放學後需要安全的去處（不想直接回家）',
    '想學程式設計、3D列印',
    '樂團需要排練空間',
    '需要同儕互動、歸屬感'
  ],
  journey: [
    {
      time: '16:30',
      hour: 16.5,
      activity: '放學抵達',
      touchpoint: '4F青少年中心',
      satisfaction: 4,
      description: '和同學一起來，這裡比家裡有趣',
      emotion: '😊 期待',
      delights: ['同儕聚集地', '自由氛圍']
    },
    {
      time: '17:00',
      hour: 17,
      activity: '打籃球',
      touchpoint: '4F籃球場',
      satisfaction: 5,
      description: '和朋友打半場籃球（預約制，每次1小時）',
      emotion: '🏀 暢快',
      delights: ['運動紓壓', '團隊活動']
    },
    {
      time: '18:00',
      hour: 18,
      activity: '參加程式課程',
      touchpoint: '4F電腦教室',
      satisfaction: 5,
      description: 'Python入門課程，外聘老師教學（免費）',
      emotion: '💻 專注',
      delights: ['學習新技能', '職涯探索']
    },
    {
      time: '19:00',
      hour: 19,
      activity: '樂團排練',
      touchpoint: '4F團練室',
      satisfaction: 5,
      description: '樂團排練新歌（隔音室，不吵到別人）',
      emotion: '🎸 投入',
      delights: ['追求興趣', '創作空間']
    },
    {
      time: '20:00',
      hour: 20,
      activity: '玩桌遊',
      touchpoint: '4F交誼廳',
      satisfaction: 5,
      description: '和朋友玩新買的桌遊「矮人礦坑」',
      emotion: '😂 歡樂',
      delights: ['社交互動', '減少3C使用']
    },
    {
      time: '20:30',
      hour: 20.5,
      activity: '父母接送回家',
      touchpoint: 'B1停車場',
      satisfaction: 4,
      description: '爸媽下班後來接（順便參加3F親職講座）',
      emotion: '😌 結束',
      delights: ['充實的一天', '有歸屬感']
    }
  ],
  summary: {
    timeSaved: '減少在家滑手機時間3小時/日',
    skillsGained: '學會Python基礎、3D列印、樂團表演',
    satisfactionScore: '10/10',
    keyBenefit: '同儕歸屬感、多元探索、職涯啟蒙'
  }
};

const allPersonas = [persona1Data, persona2Data, persona3Data];

// 情緒曲線圖組件
function EmotionalCurveChart({ journeyData, personaColor }) {
  const chartData = journeyData.map(step => ({
    time: step.time,
    satisfaction: step.satisfaction,
    description: step.activity
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`colorSat-${personaColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={personaColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={personaColor} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11 }}
          label={{ value: '時間', position: 'insideBottom', offset: -5, style: { fontSize: 12, fontWeight: 'bold' } }}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tick={{ fontSize: 11 }}
          label={{ value: '滿意度', angle: -90, position: 'insideLeft', style: { fontSize: 12, fontWeight: 'bold' } }}
        />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: `2px solid ${personaColor}`,
            borderRadius: '8px',
            padding: '10px'
          }}
          formatter={(value) => [`滿意度: ${value}/5`, '']}
        />
        <Area
          type="monotone"
          dataKey="satisfaction"
          stroke={personaColor}
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#colorSat-${personaColor})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// 單個Persona卡片組件
function PersonaCard({ persona, personaColor, isExpanded, onToggle }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: '25px',
      border: `3px solid ${personaColor}`
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          background: `linear-gradient(135deg, ${personaColor}dd 0%, ${personaColor} 100%)`,
          padding: '25px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{persona.name}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px', opacity: 0.9 }}>{persona.title}</p>
          </div>
          <div style={{ fontSize: '28px' }}>
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>

        {/* Demographics Summary */}
        <div style={{
          marginTop: '15px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          fontSize: '13px'
        }}>
          {Object.entries(persona.demographics).map(([key, value]) => (
            <div key={key} style={{ opacity: 0.95 }}>
              <strong style={{ textTransform: 'capitalize' }}>{key}:</strong> {value}
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '25px' }}>
          {/* Needs */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: personaColor, marginBottom: '12px', fontSize: '18px' }}>
              🎯 核心需求
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#444' }}>
              {persona.needs.map((need, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>{need}</li>
              ))}
            </ul>
          </div>

          {/* Emotional Curve */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: personaColor, marginBottom: '12px', fontSize: '18px' }}>
              📈 情緒滿意度曲線
            </h3>
            <EmotionalCurveChart journeyData={persona.journey} personaColor={personaColor} />
          </div>

          {/* Journey Timeline */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: personaColor, marginBottom: '15px', fontSize: '18px' }}>
              🗺️ 一日旅程
            </h3>
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: '15px',
                top: 0,
                bottom: 0,
                width: '3px',
                background: `linear-gradient(to bottom, ${personaColor}00, ${personaColor}, ${personaColor}00)`,
              }} />

              {persona.journey.map((step, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    marginBottom: '20px',
                    paddingLeft: '25px'
                  }}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '6px',
                    top: '5px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: personaColor,
                    boxShadow: `0 0 0 4px white, 0 0 0 6px ${personaColor}`
                  }} />

                  <div style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '10px',
                    border: `2px solid ${step.satisfaction >= 4 ? '#4caf50' : step.satisfaction >= 3 ? '#ff9800' : '#f44336'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: personaColor, fontSize: '15px' }}>
                        {step.time} - {step.activity}
                      </strong>
                      <span style={{ fontSize: '20px' }}>{step.emotion}</span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      <strong>📍 接觸點：</strong>{step.touchpoint}
                    </div>

                    <div style={{ fontSize: '14px', color: '#333', marginBottom: '10px' }}>
                      {step.description}
                    </div>

                    {/* Pain Points */}
                    {step.painPoints && step.painPoints.length > 0 && (
                      <div style={{
                        background: '#ffebee',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c62828',
                        marginBottom: '6px'
                      }}>
                        <strong>⚠️ 痛點：</strong>{step.painPoints.join('、')}
                      </div>
                    )}

                    {/* Delights */}
                    {step.delights && step.delights.length > 0 && (
                      <div style={{
                        background: '#e8f5e9',
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#2e7d32'
                      }}>
                        <strong>✨ 亮點：</strong>{step.delights.join('、')}
                      </div>
                    )}

                    {/* Satisfaction bar */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                        滿意度：{step.satisfaction}/5
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#e0e0e0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(step.satisfaction / 5) * 100}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${personaColor}88, ${personaColor})`,
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: `linear-gradient(135deg, ${personaColor}22, ${personaColor}11)`,
            padding: '20px',
            borderRadius: '12px',
            border: `2px solid ${personaColor}`
          }}>
            <h3 style={{ color: personaColor, marginBottom: '12px', fontSize: '18px' }}>
              💡 成效總結
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '14px',
              color: '#333'
            }}>
              {Object.entries(persona.summary).map(([key, value]) => (
                <div key={key} style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{ fontWeight: 'bold', color: personaColor }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 主組件
export function UserJourneyMaps() {
  const [expandedPersona, setExpandedPersona] = React.useState(0);

  const personaColors = ['#ff6384', '#36a2eb', '#4bc0c0'];

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#667eea',
          marginBottom: '10px',
          fontSize: '28px',
          textAlign: 'center'
        }}>
          🗺️ 用戶旅程地圖 - 赤土崎全齡社福樞紐
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '15px',
          marginBottom: '20px'
        }}>
          3種典型Persona如何使用整合式服務解決多元需求
        </p>

        {/* Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {allPersonas.map((persona, index) => (
            <div
              key={persona.id}
              onClick={() => setExpandedPersona(index)}
              style={{
                padding: '20px',
                background: expandedPersona === index ? `${personaColors[index]}22` : '#f8f9fa',
                borderRadius: '12px',
                border: `2px solid ${expandedPersona === index ? personaColors[index] : '#ddd'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: expandedPersona === index ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <h3 style={{ color: personaColors[index], marginBottom: '8px', fontSize: '18px' }}>
                {persona.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                {persona.name} - 點擊查看完整旅程
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Persona Cards */}
      {allPersonas.map((persona, index) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          personaColor={personaColors[index]}
          isExpanded={expandedPersona === index}
          onToggle={() => setExpandedPersona(expandedPersona === index ? null : index)}
        />
      ))}

      {/* 綜合洞察 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          🎯 跨Persona共通洞察
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          fontSize: '14px',
          lineHeight: '1.8'
        }}>
          <div style={{
            background: '#e8f5e9',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #4caf50'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '12px', fontSize: '16px' }}>
              ✅ 共同成功因素
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
              <li><strong>一站式整合：</strong>所有需求在同一棟建築解決，節省時間</li>
              <li><strong>分時共享：</strong>設施錯峰使用，長照、托育、青少年不衝突</li>
              <li><strong>彈性時間：</strong>7:30-21:00長時間服務，適應雙薪家庭</li>
              <li><strong>APP透明：</strong>即時照片、預約系統，家長安心</li>
              <li><strong>分流動線：</strong>B1停車場+多部電梯，接送順暢</li>
            </ul>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #ff9800'
          }}>
            <h3 style={{ color: '#e65100', marginBottom: '12px', fontSize: '16px' }}>
              ⚠️ 共同痛點
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
              <li><strong>尖峰時段擁擠：</strong>08:00-09:00、17:00-18:00接送人潮</li>
              <li><strong>停車位不足：</strong>30車位可能不夠（需周邊配套）</li>
              <li><strong>服務知悉度：</strong>需要加強宣傳，讓家庭知道整合服務</li>
              <li><strong>預約困難：</strong>熱門時段（如電腦教室、團練室）搶不到</li>
            </ul>
          </div>

          <div style={{
            background: '#e3f2fd',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #2196f3'
          }}>
            <h3 style={{ color: '#1565c0', marginBottom: '12px', fontSize: '16px' }}>
              🚀 優化建議
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
              <li><strong>增設接駁車：</strong>竹科園區↔赤土崎（尖峰時段）</li>
              <li><strong>預約優先權：</strong>多次使用者、低收戶優先預約</li>
              <li><strong>延長服務：</strong>假日09:00-21:00全日開放</li>
              <li><strong>跨齡活動：</strong>每月大型活動（三代同堂同樂會）</li>
              <li><strong>周邊停車：</strong>與周邊商場談合作（共享停車位）</li>
            </ul>
          </div>
        </div>

        {/* 量化成效 */}
        <div style={{
          marginTop: '30px',
          padding: '25px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
            📊 量化成效預估
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            fontSize: '14px'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>2小時/日</div>
              <div style={{ opacity: 0.9 }}>雙薪家庭節省接送時間</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>1.5萬/月</div>
              <div style={{ opacity: 0.9 }}>公托vs私托價差節省</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>140-180人</div>
              <div style={{ opacity: 0.9 }}>每日服務人次</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>9/10分</div>
              <div style={{ opacity: 0.9 }}>平均滿意度</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mermaid 代碼區 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '15px', fontSize: '22px' }}>
          💻 Mermaid 流程圖代碼（可直接用於Markdown）
        </h2>

        <div style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '12px',
          overflowX: 'auto'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`\`\`\`mermaid
journey
    title Persona 1: 竹科雙薪家庭的一天
    section 早上 07:00-09:00
      出門前準備: 2: 家長
      開車至赤土崎B1停車場: 4: 家長
      母親送至1F日照中心: 5: 家長
      女兒送至2F托嬰中心: 5: 家長
      前往竹科上班: 4: 家長
    section 午間 12:00-14:00
      工作時透過APP查看: 4: 家長
      母親參與認知訓練: 4: 長者
      女兒午睡: 5: 幼兒
    section 下午 17:00-19:00
      下班接送: 4: 家長
      女兒轉課後照顧: 5: 幼兒
      參加親職講座: 5: 家長
      全家3F共餐: 5: 家長, 長者, 幼兒
    section 晚間 19:00-20:00
      返家: 5: 家長
\`\`\`

\`\`\`mermaid
graph LR
    A[竹科雙薪家庭] --> B{赤土崎全齡樞紐}
    B --> C[1F 失智母親日照]
    B --> D[2F 1歲女兒托育]
    B --> E[3F 親職講座]
    B --> F[3F 社區共餐]

    C --> G[節省2小時/日]
    D --> G
    E --> G
    F --> G

    G --> H[家庭時間增加<br/>工作家庭平衡改善]

    style B fill:#667eea,color:#fff
    style H fill:#4caf50,color:#fff
\`\`\`
`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default UserJourneyMaps;
