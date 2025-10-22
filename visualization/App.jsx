import React from 'react';
import {
  CompleteDashboard,
  PainPointPriorityMatrix,
  PainPointDistribution,
  ServiceGapComparison,
  TopicCoverageRadar,
  EmotionDistributionPie,
  TimelineChart
} from './PainPointDashboard';
import { CompleteServiceTimeline, ServiceTimelineVisualizer, DetailedScheduleTable } from './ServiceTimelineVisualizer';
import { UserJourneyMaps } from './UserJourneyMaps';
import { CompleteImplementationTimeline } from './ImplementationTimeline';
import { StaffingAndBudgetDashboard } from './StaffingAndBudget';
import { InteractiveSpaceNavigator } from './InteractiveSpaceNavigator';
import { InfectionMonitoringDashboard } from './InfectionMonitoringDashboard';
import { BookingSystem } from './BookingSystem';
import { AIMatchingSystem } from './AIMatchingSystem';
import { Building3DViewer } from './Building3DViewer';

/**
 * 範例應用程式
 * 展示如何使用竹科家庭痛點分析視覺化組件
 */

function App() {
  const [selectedView, setSelectedView] = React.useState('complete');

  const views = {
    complete: { component: <CompleteDashboard />, title: '完整儀表板' },
    building3D: { component: <Building3DViewer />, title: '🏢 3D建築模型' },
    booking: { component: <BookingSystem />, title: '📅 智慧預約系統' },
    aiMatching: { component: <AIMatchingSystem />, title: '🤖 AI媒合演算法' },
    serviceTimeline: { component: <CompleteServiceTimeline />, title: '24小時服務時間軸' },
    userJourney: { component: <UserJourneyMaps />, title: '用戶旅程地圖' },
    implementation: { component: <CompleteImplementationTimeline />, title: '6個月實施時程' },
    staffingBudget: { component: <StaffingAndBudgetDashboard />, title: '人力配置與預算' },
    spaceNavigator: { component: <InteractiveSpaceNavigator />, title: '互動式空間導覽' },
    infectionMonitoring: { component: <InfectionMonitoringDashboard />, title: '感染監測儀表板' },
    matrix: { component: <PainPointPriorityMatrix />, title: '優先級矩陣' },
    distribution: { component: <PainPointDistribution />, title: '痛點分布' },
    gap: { component: <ServiceGapComparison />, title: '服務缺口' },
    radar: { component: <TopicCoverageRadar />, title: '主題覆蓋率' },
    emotion: { component: <EmotionDistributionPie />, title: '情緒分布' },
    timeline: { component: <TimelineChart />, title: '議題時間軸' }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Microsoft JhengHei', sans-serif" }}>
      {/* 導航列 */}
      <nav style={{
        position: 'sticky',
        top: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '15px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <h3 style={{ color: 'white', margin: 0, marginRight: '20px' }}>
            視覺化組件切換：
          </h3>
          {Object.entries(views).map(([key, view]) => (
            <button
              key={key}
              onClick={() => setSelectedView(key)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: selectedView === key ? 'white' : 'rgba(255,255,255,0.2)',
                color: selectedView === key ? '#667eea' : 'white',
                cursor: 'pointer',
                fontWeight: selectedView === key ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {view.title}
            </button>
          ))}
        </div>
      </nav>

      {/* 內容區 */}
      <main style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '20px'
      }}>
        {views[selectedView].component}
      </main>

      {/* 說明區 */}
      {selectedView === 'complete' && (
        <div style={{
          background: 'white',
          maxWidth: '1400px',
          margin: '20px auto',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#667eea', marginBottom: '15px' }}>
            🎯 使用說明
          </h2>
          <div style={{ color: '#666', lineHeight: '1.8' }}>
            <h3 style={{ color: '#333', fontSize: '1.1em', marginTop: '20px' }}>
              組件功能：
            </h3>
            <ul>
              <li><strong>完整儀表板</strong>：整合所有圖表的綜合視圖</li>
              <li><strong>🏢 3D建築模型</strong>：互動式 3D 建築視覺化（CSS 3D transforms）</li>
              <li><strong>📅 智慧預約系統</strong>：整合1999專線 + 新竹通APP的預約原型</li>
              <li><strong>🤖 AI媒合演算法</strong>：多維度評分機制的智慧推薦系統</li>
              <li><strong>24小時服務時間軸</strong>：展示分時共享策略</li>
              <li><strong>用戶旅程地圖</strong>：3種persona完整體驗流程</li>
              <li><strong>6個月實施時程</strong>：從標案決標到試營運的甘特圖</li>
              <li><strong>人力配置與預算</strong>：29名員工配置與收支平衡模型</li>
              <li><strong>互動式空間導覽</strong>：探索B1至4F共30個功能區</li>
              <li><strong>感染監測儀表板</strong>：符合CDC 2025標準的即時監測</li>
              <li><strong>優先級矩陣</strong>：散點圖展示痛點優先順序（影響廣度×深度）</li>
              <li><strong>痛點分布</strong>：橫條圖顯示6大痛點類別頻率</li>
              <li><strong>服務缺口</strong>：堆疊條形圖對比現有供給與需求缺口</li>
              <li><strong>主題覆蓋率</strong>：雷達圖展示6大主題在資料中的覆蓋率</li>
              <li><strong>情緒分布</strong>：圓餅圖顯示文章情緒傾向分布</li>
              <li><strong>時間軸</strong>：折線圖追蹤2021-2025年議題熱度變化</li>
            </ul>

            <h3 style={{ color: '#333', fontSize: '1.1em', marginTop: '25px' }}>
              黑客松8分鐘簡報建議：
            </h3>
            <ol>
              <li><strong>開場30秒</strong>：痛點分布 + 時間軸（證明問題持續5年）</li>
              <li><strong>解決方案2分鐘</strong>：3D建築模型 + 24小時服務時間軸</li>
              <li><strong>用戶體驗2分鐘</strong>：用戶旅程地圖（展示3種persona）</li>
              <li><strong>技術創新1.5分鐘</strong>：智慧預約系統 + AI媒合演算法</li>
              <li><strong>可行性1.5分鐘</strong>：6個月實施時程 + 人力配置與預算</li>
              <li><strong>總結30秒</strong>：完整儀表板（數據驅動的全面分析）</li>
            </ol>

            <h3 style={{ color: '#333', fontSize: '1.1em', marginTop: '25px' }}>
              數據來源：
            </h3>
            <ul>
              <li>原始資料：19篇竹科家庭相關文章</li>
              <li>處理後：11篇高品質文章（去重率42%）</li>
              <li>時間跨度：2021-2025年（5年）</li>
              <li>分析方法：紮根理論三層級編碼 + 交叉驗證5份政策研究報告</li>
            </ul>

            <h3 style={{ color: '#333', fontSize: '1.1em', marginTop: '25px' }}>
              截圖建議：
            </h3>
            <p>
              如需在PowerPoint中使用，建議使用瀏覽器開發者工具（F12）或截圖工具
              捕捉高解析度圖表。每個圖表都包含「關鍵洞察」說明框，可直接作為簡報備註。
            </p>

            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '25px'
            }}>
              <h4 style={{ color: '#d68910', margin: '0 0 10px 0' }}>
                ⚡ 黑客松簡報技巧
              </h4>
              <ul style={{ margin: 0, color: '#856404' }}>
                <li>優先級矩陣：指著右上角說「時間類痛點是絕對優先」</li>
                <li>服務缺口圖：用紅色區塊強調「100%和91%缺口」</li>
                <li>時間軸：對比2022年2篇 vs 2025年8篇，說明「問題持續惡化」</li>
                <li>完整儀表板：結尾時展示，呈現「數據驅動的全面分析」</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
