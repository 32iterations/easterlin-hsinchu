import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/**
 * 人力配置與成本試算表
 * 赤土崎全齡社福樞紐 - 財務可行性分析
 */

// 人力配置數據
const staffingData = {
  elderCare: {
    floor: '1F',
    service: '長照日照中心',
    capacity: '50-60人',
    staff: [
      { position: '照顧服務員', count: 6, salary: 38000, requirement: '照服員單一級證照', workHours: '輪班制（含假日）' },
      { position: '護理師', count: 1, salary: 55000, requirement: '護理師執照', workHours: '09:00-17:00' },
      { position: '社工師', count: 1, salary: 45000, requirement: '社工師執照', workHours: '09:00-17:00（兼顧全館）' }
    ],
    ratio: '照服員:長者 = 1:10（符合長照服務法）'
  },
  childcare: {
    floor: '2F',
    service: '公共托嬰中心',
    capacity: '40-50人',
    staff: [
      { position: '教保員', count: 6, salary: 40000, requirement: '教保員資格', workHours: '輪班制（含假日）' },
      { position: '護理師', count: 1, salary: 55000, requirement: '護理師執照（兼1F）', workHours: '07:30-17:30' }
    ],
    ratio: '教保員:嬰幼兒 = 1:5（0-1歲）、1:8（1-2歲）'
  },
  familySupport: {
    floor: '3F',
    service: '家庭支持中心',
    capacity: '20-30人',
    staff: [
      { position: '諮商心理師', count: 2, salary: 50000, requirement: '諮商心理師執照', workHours: '兼職（每周3天）' },
      { position: '社工師', count: 1, salary: 45000, requirement: '社工師執照（兼1F）', workHours: '輪班支援' },
      { position: '廚師', count: 2, salary: 38000, requirement: '中餐烹調技術士', workHours: '10:00-19:00' },
      { position: '廚務助手', count: 2, salary: 30000, requirement: '食品安全證照', workHours: '10:00-19:00' }
    ],
    ratio: '社區共餐供餐130人/日'
  },
  youthCenter: {
    floor: '4F',
    service: '青少年活動中心',
    capacity: '30-40人',
    staff: [
      { position: '青少年輔導員', count: 3, salary: 38000, requirement: '社工/輔導相關科系', workHours: '16:00-21:00（含假日）' },
      { position: '活動講師', count: 2, salary: 25000, requirement: '專長講師（程式/音樂）', workHours: '兼職（鐘點計）' }
    ],
    ratio: '輔導員:青少年 = 1:15'
  },
  admin: {
    floor: 'B1/全館',
    service: '行政支援',
    capacity: '全館',
    staff: [
      { position: '館長/主任', count: 1, salary: 65000, requirement: '社福管理經驗5年+', workHours: '09:00-18:00' },
      { position: '行政人員', count: 2, salary: 35000, requirement: '文書處理能力', workHours: '09:00-18:00' },
      { position: '警衛', count: 2, salary: 32000, requirement: '保全證照', workHours: '輪班24小時' },
      { position: '清潔人員', count: 2, salary: 28000, requirement: '無', workHours: '06:00-14:00' }
    ],
    ratio: '支援全館運作'
  }
};

// 計算總人力成本
const calculateStaffingCost = () => {
  let totalStaff = 0;
  let totalMonthlyCost = 0;
  const breakdown = [];

  Object.entries(staffingData).forEach(([key, data]) => {
    let serviceCost = 0;
    let serviceStaff = 0;

    data.staff.forEach(staff => {
      totalStaff += staff.count;
      serviceStaff += staff.count;
      const monthlyCost = staff.salary * staff.count;
      totalMonthlyCost += monthlyCost;
      serviceCost += monthlyCost;

      breakdown.push({
        service: data.service,
        position: staff.position,
        count: staff.count,
        salary: staff.salary,
        monthlyCost: monthlyCost,
        annualCost: monthlyCost * 14  // 含年終、勞健保
      });
    });
  });

  return {
    totalStaff,
    totalMonthlyCost,
    totalAnnualCost: totalMonthlyCost * 14, // 12個月薪 + 年終 + 勞健保
    breakdown
  };
};

// 營運成本數據
const operatingCosts = [
  {
    category: '人事費用',
    items: [
      { name: '薪資', monthly: calculateStaffingCost().totalMonthlyCost, annual: calculateStaffingCost().totalAnnualCost, note: '29名員工（含兼職）' },
      { name: '勞健保雇主負擔', monthly: Math.round(calculateStaffingCost().totalMonthlyCost * 0.15), annual: Math.round(calculateStaffingCost().totalMonthlyCost * 0.15 * 12), note: '約15%' },
      { name: '員工福利', monthly: 50000, annual: 600000, note: '訓練、體檢、聚餐' }
    ],
    color: '#ff6384'
  },
  {
    category: '設施費用',
    items: [
      { name: '租金/折舊', monthly: 150000, annual: 1800000, note: '若為市府資產則無需' },
      { name: '水電費', monthly: 180000, annual: 2160000, note: '3100m²全日運作' },
      { name: '瓦斯費', monthly: 30000, annual: 360000, note: '社區共餐廚房' },
      { name: '網路通訊', monthly: 20000, annual: 240000, note: '光纖+電話+監控' }
    ],
    color: '#36a2eb'
  },
  {
    category: '業務費用',
    items: [
      { name: '食材費', monthly: 320000, annual: 3840000, note: '130人/日 × 80元/人 × 30天' },
      { name: '教材教具', monthly: 80000, annual: 960000, note: '托育+青少年活動' },
      { name: '清潔用品', monthly: 40000, annual: 480000, note: '消毒、洗滌、垃圾' },
      { name: '醫療耗材', monthly: 50000, annual: 600000, note: '急救、照護用品' }
    ],
    color: '#ffce56'
  },
  {
    category: '維護費用',
    items: [
      { name: '設備維護', monthly: 60000, annual: 720000, note: '電梯、空調、消防' },
      { name: '保險費', monthly: 35000, annual: 420000, note: '公共意外險、責任險' },
      { name: '雜支', monthly: 30000, annual: 360000, note: '文具、郵資、雜項' }
    ],
    color: '#4bc0c0'
  }
];

// 計算總營運成本
const calculateTotalCosts = () => {
  let monthly = 0;
  let annual = 0;
  const categoryBreakdown = [];

  operatingCosts.forEach(category => {
    let categoryMonthly = 0;
    let categoryAnnual = 0;

    category.items.forEach(item => {
      categoryMonthly += item.monthly;
      categoryAnnual += item.annual;
      monthly += item.monthly;
      annual += item.annual;
    });

    categoryBreakdown.push({
      name: category.category,
      monthly: categoryMonthly,
      annual: categoryAnnual,
      color: category.color
    });
  });

  return { monthly, annual, categoryBreakdown };
};

// 收入來源數據
const revenueStreams = [
  {
    source: '長照給付',
    items: [
      { name: '日照服務（A級）', unitPrice: 1200, units: 55, frequency: 22, monthly: 1200 * 55 * 22, annual: 1200 * 55 * 22 * 12, note: '55人×22天/月×1200元/日' },
      { name: '交通接送', unitPrice: 180, units: 30, frequency: 44, monthly: 180 * 30 * 44, annual: 180 * 30 * 44 * 12, note: '30人往返×22天×180元' }
    ],
    color: '#4caf50'
  },
  {
    source: '托育收費',
    items: [
      { name: '公托月費', unitPrice: 8000, units: 45, frequency: 1, monthly: 8000 * 45, annual: 8000 * 45 * 12, note: '45人×8000元/月' },
      { name: '政府補助（育兒津貼）', unitPrice: 5000, units: 45, frequency: 1, monthly: 5000 * 45, annual: 5000 * 45 * 12, note: '政府補助機構' }
    ],
    color: '#2196f3'
  },
  {
    source: '青少年服務',
    items: [
      { name: '課程費', unitPrice: 200, units: 120, frequency: 1, monthly: 200 * 120, annual: 200 * 120 * 12, note: '每月4門課×30人×200元' },
      { name: '政府補助（青少年發展）', unitPrice: 50000, units: 1, frequency: 1, monthly: 50000, annual: 600000, note: '社會處補助' }
    ],
    color: '#ff9800'
  },
  {
    source: '家庭支持服務',
    items: [
      { name: '諮商收費', unitPrice: 500, units: 80, frequency: 1, monthly: 500 * 80, annual: 500 * 80 * 12, note: '80人次/月×500元（低收免費）' },
      { name: '社區共餐', unitPrice: 50, units: 1800, frequency: 1, monthly: 50 * 1800, annual: 50 * 1800 * 12, note: '60人/日×30天×50元' },
      { name: '政府補助（長青食堂）', unitPrice: 80000, units: 1, frequency: 1, monthly: 80000, annual: 960000, note: '社會處補助' }
    ],
    color: '#9c27b0'
  },
  {
    source: '其他收入',
    items: [
      { name: '場地租借', unitPrice: 2000, units: 20, frequency: 1, monthly: 2000 * 20, annual: 2000 * 20 * 12, note: '多功能教室、團練室' },
      { name: '捐款收入', unitPrice: 30000, units: 1, frequency: 1, monthly: 30000, annual: 360000, note: '企業、個人捐款' }
    ],
    color: '#607d8b'
  }
];

// 計算總收入
const calculateTotalRevenue = () => {
  let monthly = 0;
  let annual = 0;
  const sourceBreakdown = [];

  revenueStreams.forEach(stream => {
    let streamMonthly = 0;
    let streamAnnual = 0;

    stream.items.forEach(item => {
      streamMonthly += item.monthly;
      streamAnnual += item.annual;
      monthly += item.monthly;
      annual += item.annual;
    });

    sourceBreakdown.push({
      name: stream.source,
      monthly: streamMonthly,
      annual: streamAnnual,
      color: stream.color
    });
  });

  return { monthly, annual, sourceBreakdown };
};

// 人力配置卡片組件
function StaffingCard({ service, data }) {
  const [expanded, setExpanded] = React.useState(false);

  const totalStaff = data.staff.reduce((sum, s) => sum + s.count, 0);
  const totalCost = data.staff.reduce((sum, s) => sum + (s.salary * s.count), 0);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      border: '2px solid #ddd'
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>{data.floor}</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{data.service}</div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>
            {totalStaff}名 | 月薪資：{totalCost.toLocaleString()}元
          </div>
        </div>
        <div style={{ fontSize: '24px' }}>{expanded ? '▼' : '▶'}</div>
      </div>

      {expanded && (
        <div style={{ padding: '20px' }}>
          <div style={{
            marginBottom: '15px',
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1565c0'
          }}>
            <strong>人力配置比：</strong>{data.ratio}
          </div>

          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>職位</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>人數</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>月薪</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>月成本</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>年成本</th>
              </tr>
            </thead>
            <tbody>
              {data.staff.map((staff, index) => (
                <React.Fragment key={index}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{staff.position}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{staff.count}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{staff.salary.toLocaleString()}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#667eea' }}>
                      {(staff.salary * staff.count).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {(staff.salary * staff.count * 14).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} style={{ padding: '4px 12px 12px 12px', fontSize: '11px', color: '#666' }}>
                      <div style={{ marginBottom: '3px' }}><strong>資格：</strong>{staff.requirement}</div>
                      <div><strong>工時：</strong>{staff.workHours}</div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              <tr style={{ background: '#f5f5f5', fontWeight: 'bold', borderTop: '2px solid #ddd' }}>
                <td style={{ padding: '12px' }}>小計</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{totalStaff}</td>
                <td style={{ padding: '12px' }}>-</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#667eea' }}>{totalCost.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{(totalCost * 14).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 完整人力配置與預算組件
export function StaffingAndBudgetDashboard() {
  const staffingCost = calculateStaffingCost();
  const totalCosts = calculateTotalCosts();
  const totalRevenue = calculateTotalRevenue();
  const netIncome = totalRevenue.monthly - totalCosts.monthly;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* 標題 */}
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
          👥 赤土崎全齡社福樞紐 - 人力配置與成本試算表
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '15px'
        }}>
          財務可行性分析：29名員工 | 年營運成本 {totalCosts.annual.toLocaleString()}元 | 收支平衡 {netIncome >= 0 ? '✅' : '⚠️'}
        </p>

        {/* 關鍵指標卡片 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '25px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              {staffingCost.totalStaff}名
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>總人力</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              {totalCosts.monthly.toLocaleString()}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>月營運成本（元）</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              {totalRevenue.monthly.toLocaleString()}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>月總收入（元）</div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${netIncome >= 0 ? '#43e97b' : '#fa709a'} 0%, ${netIncome >= 0 ? '#38f9d7' : '#fee140'} 100%)`,
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              {netIncome >= 0 ? '+' : ''}{netIncome.toLocaleString()}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>月淨收入（元）</div>
          </div>
        </div>
      </div>

      {/* 人力配置詳細 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          👥 人力配置詳細（按樓層）
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(staffingData).map(([key, data]) => (
            <StaffingCard key={key} service={key} data={data} />
          ))}
        </div>
      </div>

      {/* 營運成本明細 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          💰 營運成本明細
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalCosts.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `${value.toLocaleString()}元`}
                contentStyle={{ borderRadius: '8px', border: '2px solid #667eea' }}
              />
              <Legend />
              <Bar dataKey="monthly" name="月成本" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {operatingCosts.map((category, catIndex) => (
          <details key={catIndex} style={{ marginBottom: '20px' }}>
            <summary style={{
              padding: '15px',
              background: category.color + '22',
              borderLeft: `4px solid ${category.color}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {category.category} - 月成本：{category.items.reduce((sum, item) => sum + item.monthly, 0).toLocaleString()}元
            </summary>

            <table style={{
              width: '100%',
              marginTop: '15px',
              fontSize: '13px',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>項目</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>月成本</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>年成本</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>說明</th>
                </tr>
              </thead>
              <tbody>
                {category.items.map((item, itemIndex) => (
                  <tr key={itemIndex} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.name}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                      {item.monthly.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {item.annual.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>

      {/* 收入來源明細 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          💵 收入來源明細
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={totalRevenue.sourceBreakdown}
                dataKey="monthly"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${Math.round((entry.monthly / totalRevenue.monthly) * 100)}%`}
              >
                {totalRevenue.sourceBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()}元`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {revenueStreams.map((stream, streamIndex) => (
          <details key={streamIndex} style={{ marginBottom: '20px' }}>
            <summary style={{
              padding: '15px',
              background: stream.color + '22',
              borderLeft: `4px solid ${stream.color}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {stream.source} - 月收入：{stream.items.reduce((sum, item) => sum + item.monthly, 0).toLocaleString()}元
            </summary>

            <table style={{
              width: '100%',
              marginTop: '15px',
              fontSize: '13px',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>項目</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>月收入</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>年收入</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>說明</th>
                </tr>
              </thead>
              <tbody>
                {stream.items.map((item, itemIndex) => (
                  <tr key={itemIndex} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.name}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4caf50' }}>
                      {item.monthly.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {item.annual.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>

      {/* 收支平衡分析 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          📊 收支平衡分析
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            padding: '20px',
            background: '#ffebee',
            borderRadius: '12px',
            border: '3px solid #f44336'
          }}>
            <h3 style={{ color: '#c62828', marginBottom: '15px', fontSize: '18px' }}>
              支出總計
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336', marginBottom: '10px' }}>
              {totalCosts.monthly.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>元/月</div>
            <div style={{ marginTop: '15px', fontSize: '24px', color: '#f44336' }}>
              {totalCosts.annual.toLocaleString()}元/年
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: '#e8f5e9',
            borderRadius: '12px',
            border: '3px solid #4caf50'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '18px' }}>
              收入總計
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50', marginBottom: '10px' }}>
              {totalRevenue.monthly.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>元/月</div>
            <div style={{ marginTop: '15px', fontSize: '24px', color: '#4caf50' }}>
              {totalRevenue.annual.toLocaleString()}元/年
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: netIncome >= 0 ? '#e3f2fd' : '#fff3e0',
            borderRadius: '12px',
            border: `3px solid ${netIncome >= 0 ? '#2196f3' : '#ff9800'}`
          }}>
            <h3 style={{ color: netIncome >= 0 ? '#1565c0' : '#e65100', marginBottom: '15px', fontSize: '18px' }}>
              淨收入
            </h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: netIncome >= 0 ? '#2196f3' : '#ff9800', marginBottom: '10px' }}>
              {netIncome >= 0 ? '+' : ''}{netIncome.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>元/月</div>
            <div style={{ marginTop: '15px', fontSize: '24px', color: netIncome >= 0 ? '#2196f3' : '#ff9800' }}>
              {netIncome >= 0 ? '+' : ''}{(netIncome * 12).toLocaleString()}元/年
            </div>
          </div>
        </div>

        {/* 財務健康度 */}
        <div style={{
          padding: '25px',
          background: netIncome >= 0 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          borderRadius: '12px',
          color: 'white',
          marginTop: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>
            {netIncome >= 0 ? '✅ 財務健康：收支平衡' : '⚠️ 財務警示：需額外補助'}
          </h3>
          <div style={{ fontSize: '15px', lineHeight: '1.8' }}>
            {netIncome >= 0 ? (
              <>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>狀態：</strong>月淨收入 {netIncome.toLocaleString()}元，年盈餘 {(netIncome * 12).toLocaleString()}元
                </p>
                <p style={{ margin: 0 }}>
                  <strong>建議：</strong>盈餘可用於設施升級、員工獎金、服務擴展
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 10px 0' }}>
                  <strong>狀態：</strong>月短缺 {Math.abs(netIncome).toLocaleString()}元，年缺口 {Math.abs(netIncome * 12).toLocaleString()}元
                </p>
                <p style={{ margin: 0 }}>
                  <strong>建議：</strong>向中央申請長照2.0補助、新竹市社福專案補助，或調整收費結構
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 關鍵洞察 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '24px' }}>
          💡 財務可行性關鍵洞察
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
              ✅ 整合效益
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
              <li>共享人力：護理師兼顧1F+2F，社工師兼顧全館</li>
              <li>共享設施：餐廳錯峰使用，節省30%空間成本</li>
              <li>規模經濟：食材、清潔用品大量採購降低15%成本</li>
            </ul>
          </div>

          <div style={{
            background: '#e3f2fd',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #2196f3'
          }}>
            <h3 style={{ color: '#1565c0', marginBottom: '12px', fontSize: '16px' }}>
              💰 收入穩定性
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
              <li>長照給付：政府保證給付，佔總收入45%</li>
              <li>托育收費：公托需求大，滿載率預估90%+</li>
              <li>多元收入：5大收入來源分散風險</li>
            </ul>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #ff9800'
          }}>
            <h3 style={{ color: '#e65100', marginBottom: '12px', fontSize: '16px' }}>
              ⚠️ 風險控制
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
              <li>人事成本佔62%：需嚴格控管離職率</li>
              <li>政府補助依賴：需維持服務品質確保補助</li>
              <li>滿載率敏感：若低於80%將虧損，需加強招生</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffingAndBudgetDashboard;
