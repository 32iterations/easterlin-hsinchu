import React, { useState } from 'react';

/**
 * 預約系統原型
 * 整合1999專線 + 新竹通APP + 線上預約
 * 支援6大服務類型的智慧預約流程
 */

// 服務類型定義
const serviceTypes = [
  {
    id: 'elder-care',
    name: '長照日照中心',
    floor: '1F',
    icon: '👴',
    capacity: 60,
    openHours: '09:00-17:00',
    features: ['失智專區', '一般日照', '復健訓練', '營養午餐'],
    price: '政府補助後 500-2000元/日',
    bookingWindow: '7天前',
    color: '#FFB6C1'
  },
  {
    id: 'childcare',
    name: '公共托嬰中心',
    floor: '2F',
    icon: '👶',
    capacity: 40,
    openHours: '07:30-18:30',
    features: ['0-2歲托育', '親子共學', '感覺統合', '營養副食品'],
    price: '月費 8000-12000元',
    bookingWindow: '等候名單制',
    color: '#FFE4B5'
  },
  {
    id: 'after-school',
    name: '課後照顧班',
    floor: '3F',
    icon: '📚',
    capacity: 30,
    openHours: '15:00-19:00',
    features: ['作業輔導', '才藝課程', '晚餐供應', '接送服務'],
    price: '月費 6000-8000元',
    bookingWindow: '學期制報名',
    color: '#B0E0E6'
  },
  {
    id: 'youth-center',
    name: '青少年活動中心',
    floor: '4F',
    icon: '🎮',
    capacity: 40,
    openHours: '14:00-21:00',
    features: ['自習空間', '社團活動', '職涯探索', '心理諮商'],
    price: '免費（部分課程收費）',
    bookingWindow: '當日預約',
    color: '#DDA0DD'
  },
  {
    id: 'family-support',
    name: '家庭支持服務',
    floor: '3F',
    icon: '👨‍👩‍👧',
    capacity: 20,
    openHours: '09:00-21:00',
    features: ['親職講座', '家庭諮商', '喘息服務', '資源媒合'],
    price: '免費',
    bookingWindow: '3天前',
    color: '#98FB98'
  },
  {
    id: 'community-dining',
    name: '社區共餐',
    floor: '1F/4F',
    icon: '🍱',
    capacity: 100,
    openHours: '11:30-13:00, 17:30-19:00',
    features: ['營養午餐', '晚餐供應', '長者共餐', '親子共食'],
    price: '50-120元/餐',
    bookingWindow: '當日10:00前',
    color: '#F0E68C'
  }
];

// 預約管道
const bookingChannels = [
  {
    id: 'app',
    name: '新竹通APP',
    icon: '📱',
    description: '24小時線上預約',
    features: ['即時查詢空位', 'AI智慧推薦', '電子繳費', '預約提醒'],
    advantages: '最推薦',
    color: '#4CAF50'
  },
  {
    id: 'phone',
    name: '1999市民專線',
    icon: '☎️',
    description: '真人客服協助',
    features: ['專人解說', '長者友善', '多語服務', '緊急處理'],
    advantages: '適合不熟悉3C的長者',
    color: '#2196F3'
  },
  {
    id: 'web',
    name: '官網預約系統',
    icon: '💻',
    description: '電腦版完整功能',
    features: ['批次預約', '家庭帳號', '繳費記錄', '服務評價'],
    advantages: '功能最完整',
    color: '#9C27B0'
  },
  {
    id: 'onsite',
    name: '現場櫃台',
    icon: '🏢',
    description: '臨櫃辦理',
    features: ['面對面諮詢', '當日候補', '緊急安排', '資料審核'],
    advantages: '緊急需求',
    color: '#FF9800'
  }
];

// 預約狀態
const bookingStatuses = {
  pending: { label: '待確認', color: '#FFA726', icon: '⏳' },
  confirmed: { label: '已確認', color: '#66BB6A', icon: '✅' },
  waitlist: { label: '候補中', color: '#42A5F5', icon: '📋' },
  cancelled: { label: '已取消', color: '#EF5350', icon: '❌' },
  completed: { label: '已完成', color: '#78909C', icon: '✔️' }
};

// 模擬預約資料
const mockBookings = [
  {
    id: 'BK001',
    userName: '陳先生',
    service: 'elder-care',
    date: '2025-10-25',
    time: '09:00',
    status: 'confirmed',
    channel: 'app',
    note: '失智長輩，需專人接送'
  },
  {
    id: 'BK002',
    userName: '林小姐',
    service: 'childcare',
    date: '2025-11-01',
    time: '07:30',
    status: 'waitlist',
    channel: 'phone',
    note: '6個月寶寶，優先托育名單'
  },
  {
    id: 'BK003',
    userName: '王太太',
    service: 'after-school',
    date: '2025-10-23',
    time: '15:00',
    status: 'confirmed',
    channel: 'web',
    note: '雙胞胎兄弟，需晚餐'
  }
];

// 統計數據
const systemStats = {
  totalBookings: 1247,
  todayBookings: 82,
  averageWaitTime: '2.3天',
  satisfactionRate: '4.7/5.0',
  peakHours: ['08:00-09:00', '17:00-18:00'],
  popularServices: ['長照日照', '公共托嬰', '課後照顧']
};

// 主組件
export function BookingSystem() {
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
          📅 智慧預約系統
        </h1>
        <p style={{ margin: 0, fontSize: '1.2em', opacity: 0.95 }}>
          赤土崎全齡社福樞紐 - 整合1999專線 + 新竹通APP + 線上預約
        </p>
      </div>

      {/* 系統統計 */}
      <SystemStatistics stats={systemStats} />

      {/* 預約管道選擇 */}
      <BookingChannels channels={bookingChannels} />

      {/* 服務類型選擇 */}
      <ServiceSelector services={serviceTypes} />

      {/* 預約流程圖 */}
      <BookingFlowDiagram />

      {/* 預約表單 */}
      <BookingForm services={serviceTypes} channels={bookingChannels} />

      {/* 我的預約 */}
      <MyBookings bookings={mockBookings} services={serviceTypes} />

      {/* AI智慧推薦 */}
      <AIRecommendation services={serviceTypes} />
    </div>
  );
}

// 系統統計組件
function SystemStatistics({ stats }) {
  const statCards = [
    { label: '累計預約', value: stats.totalBookings, icon: '📊', color: '#4CAF50' },
    { label: '今日預約', value: stats.todayBookings, icon: '📅', color: '#2196F3' },
    { label: '平均等候', value: stats.averageWaitTime, icon: '⏰', color: '#FF9800' },
    { label: '滿意度', value: stats.satisfactionRate, icon: '⭐', color: '#F44336' }
  ];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📈 系統統計</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {statCards.map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: `5px solid ${stat.color}`
          }}>
            <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{stat.icon}</div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: stat.color, marginBottom: '5px' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '1.1em' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 預約管道組件
function BookingChannels({ channels }) {
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📱 預約管道</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {channels.map(channel => (
          <div
            key={channel.id}
            onClick={() => setSelectedChannel(channel.id === selectedChannel ? null : channel.id)}
            style={{
              background: selectedChannel === channel.id ? channel.color : 'white',
              color: selectedChannel === channel.id ? 'white' : '#333',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedChannel === channel.id ? `3px solid ${channel.color}` : '3px solid transparent'
            }}
          >
            <div style={{ fontSize: '3em', marginBottom: '15px' }}>{channel.icon}</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3em' }}>{channel.name}</h3>
            <p style={{ margin: '0 0 15px 0', opacity: 0.9 }}>{channel.description}</p>

            {selectedChannel === channel.id && (
              <div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>功能特色：</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {channel.features.map((feature, idx) => (
                      <li key={idx} style={{ marginBottom: '5px' }}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.3)',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  💡 {channel.advantages}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 服務選擇組件
function ServiceSelector({ services }) {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🏢 服務類型</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
            style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: selectedService === service.id ? `3px solid ${service.color}` : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '2.5em', marginRight: '15px' }}>{service.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', color: service.color }}>{service.name}</h3>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                  {service.floor} | {service.openHours}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>容量</div>
                <div style={{ fontWeight: 'bold', color: service.color }}>{service.capacity}人</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>預約窗口</div>
                <div style={{ fontWeight: 'bold', color: service.color }}>{service.bookingWindow}</div>
              </div>
            </div>

            {selectedService === service.id && (
              <div>
                <div style={{
                  background: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>服務內容：</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {service.features.map((feature, idx) => (
                      <span key={idx} style={{
                        background: service.color,
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '0.9em'
                      }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  padding: '10px',
                  borderRadius: '6px',
                  color: '#856404'
                }}>
                  💰 收費標準：{service.price}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 預約流程圖組件
function BookingFlowDiagram() {
  const steps = [
    {
      step: 1,
      title: '選擇服務',
      description: '從6大服務類型中選擇',
      icon: '🔍',
      color: '#4CAF50'
    },
    {
      step: 2,
      title: '選擇日期時間',
      description: '查看即時空位狀況',
      icon: '📅',
      color: '#2196F3'
    },
    {
      step: 3,
      title: '填寫資料',
      description: '個人資料與特殊需求',
      icon: '📝',
      color: '#FF9800'
    },
    {
      step: 4,
      title: 'AI智慧推薦',
      description: '系統推薦最適合的組合',
      icon: '🤖',
      color: '#9C27B0'
    },
    {
      step: 5,
      title: '確認送出',
      description: '選擇支付方式並確認',
      icon: '✅',
      color: '#F44336'
    },
    {
      step: 6,
      title: '收到通知',
      description: 'APP推播 + 簡訊提醒',
      icon: '📲',
      color: '#00BCD4'
    }
  ];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🔄 預約流程</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          position: 'relative'
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{
                background: step.color,
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
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
                  marginBottom: '10px'
                }}>
                  {step.step}
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1em' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.95 }}>
                  {step.description}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-10px',
                  transform: 'translateY(-50%)',
                  fontSize: '2em',
                  color: '#ccc',
                  zIndex: 1
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#e8f5e9',
          borderRadius: '8px',
          borderLeft: '5px solid #4CAF50'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>⚡ 快速預約功能</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
            <li>「家庭帳號」：一次預約多人多項服務</li>
            <li>「AI推薦」：根據家庭狀況智慧推薦服務組合</li>
            <li>「候補通知」：有空位立即推播通知</li>
            <li>「彈性調整」：最遲3天前可免費取消或更改</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 預約表單組件
function BookingForm({ services, channels }) {
  const [formData, setFormData] = useState({
    service: '',
    channel: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('預約已送出！（這是示範原型，實際系統會整合後端API）');
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📝 立即預約</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                選擇服務 *
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '1em'
                }}
                required
              >
                <option value="">請選擇...</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.icon} {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                預約管道 *
              </label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '1em'
                }}
                required
              >
                <option value="">請選擇...</option>
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.icon} {channel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                預約日期 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '1em'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                預約時間 *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '1em'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                聯絡人姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="請輸入姓名"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '1em'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                聯絡電話 *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912-345-678"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #ddd',
                  fontSize: '1em'
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              特殊需求說明
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="例如：輪椅使用者、飲食禁忌、藥物過敏等..."
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #ddd',
                fontSize: '1em',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '15px 40px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            送出預約
          </button>
        </form>
      </div>
    </div>
  );
}

// 我的預約組件
function MyBookings({ bookings, services }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 我的預約</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {bookings.map((booking, idx) => {
          const service = services.find(s => s.id === booking.service);
          const status = bookingStatuses[booking.status];

          return (
            <div
              key={idx}
              style={{
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #eee',
                marginBottom: idx < bookings.length - 1 ? '15px' : 0,
                background: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '2em', marginRight: '15px' }}>{service.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: service.color }}>
                    {service.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>
                    預約編號：{booking.id}
                  </div>
                </div>
                <div style={{
                  background: status.color,
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  {status.icon} {status.label}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>預約人</div>
                  <div style={{ fontWeight: 'bold' }}>{booking.userName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>日期時間</div>
                  <div style={{ fontWeight: 'bold' }}>{booking.date} {booking.time}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '3px' }}>預約管道</div>
                  <div style={{ fontWeight: 'bold' }}>
                    {bookingChannels.find(c => c.id === booking.channel)?.name}
                  </div>
                </div>
              </div>

              {booking.note && (
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.9em',
                  color: '#856404'
                }}>
                  📝 備註：{booking.note}
                </div>
              )}

              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: '2px solid #667eea',
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  修改
                </button>
                <button style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: '2px solid #f44336',
                  background: 'white',
                  color: '#f44336',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  取消
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// AI智慧推薦組件
function AIRecommendation({ services }) {
  const [familyProfile, setFamilyProfile] = useState({
    hasElder: false,
    hasChild: false,
    hasTeenager: false,
    needCounseling: false
  });

  const getRecommendations = () => {
    const recommendations = [];

    if (familyProfile.hasElder) {
      recommendations.push(services.find(s => s.id === 'elder-care'));
      recommendations.push(services.find(s => s.id === 'community-dining'));
    }

    if (familyProfile.hasChild) {
      recommendations.push(services.find(s => s.id === 'childcare'));
      recommendations.push(services.find(s => s.id === 'after-school'));
    }

    if (familyProfile.hasTeenager) {
      recommendations.push(services.find(s => s.id === 'youth-center'));
    }

    if (familyProfile.needCounseling || (familyProfile.hasElder && familyProfile.hasChild)) {
      recommendations.push(services.find(s => s.id === 'family-support'));
    }

    return recommendations.filter(Boolean);
  };

  const recommendations = getRecommendations();

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🤖 AI智慧推薦</h2>
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
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>請告訴我們您的家庭狀況</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>AI將根據您的需求推薦最適合的服務組合</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          {[
            { key: 'hasElder', label: '家中有長輩需照顧', icon: '👴' },
            { key: 'hasChild', label: '家中有幼兒需托育', icon: '👶' },
            { key: 'hasTeenager', label: '家中有青少年', icon: '🎓' },
            { key: 'needCounseling', label: '需要家庭諮商', icon: '💬' }
          ].map(item => (
            <label
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                cursor: 'pointer',
                background: familyProfile[item.key] ? '#e8f5e9' : 'white',
                borderColor: familyProfile[item.key] ? '#4CAF50' : '#ddd'
              }}
            >
              <input
                type="checkbox"
                checked={familyProfile[item.key]}
                onChange={(e) => setFamilyProfile({ ...familyProfile, [item.key]: e.target.checked })}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '1.5em', marginRight: '10px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div>
            <div style={{
              background: '#e8f5e9',
              borderLeft: '5px solid #4CAF50',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>
                🎯 為您推薦 {recommendations.length} 項服務
              </h4>
              <p style={{ margin: 0, color: '#666' }}>
                根據您的家庭狀況，以下服務組合最適合您：
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {recommendations.map((service, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    border: `2px solid ${service.color}`,
                    background: '#fafafa'
                  }}
                >
                  <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{service.icon}</div>
                  <h4 style={{ margin: '0 0 8px 0', color: service.color }}>{service.name}</h4>
                  <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                    {service.floor} | {service.openHours}
                  </div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    {service.price}
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              marginTop: '20px',
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              一鍵預約全部服務
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingSystem;
