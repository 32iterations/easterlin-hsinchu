import React from 'react';

/**
 * 赤土崎全齡社福樞紐 - 6個月實施時程甘特圖
 * 從標案決標（2025/10/30）到試營運（2026/04/30）
 */

// 時程數據
const implementationPhases = [
  {
    phase: 'Phase 0',
    name: '標案決標',
    tasks: [
      {
        id: 'P0-1',
        name: '開標評選',
        start: '2025-10-30',
        end: '2025-11-07',
        duration: 8,
        status: 'critical',
        responsible: '新竹市政府社會處',
        deliverables: ['決標公告', '簽約'],
        color: '#ff6384'
      }
    ]
  },
  {
    phase: 'Phase 1',
    name: '規劃設計階段',
    tasks: [
      {
        id: 'P1-1',
        name: '基地現況調查',
        start: '2025-11-08',
        end: '2025-11-21',
        duration: 14,
        status: 'in-progress',
        responsible: '建築師事務所',
        deliverables: ['測量報告', '地質調查', '交通動線分析'],
        color: '#36a2eb'
      },
      {
        id: 'P1-2',
        name: '使用者需求訪談',
        start: '2025-11-08',
        end: '2025-11-28',
        duration: 21,
        status: 'in-progress',
        responsible: '社福單位 + 建築師',
        deliverables: ['需求訪談報告', 'Persona分析', '空間需求表'],
        color: '#36a2eb',
        notes: '🔥 黑客松提案可在此階段影響功能設計'
      },
      {
        id: 'P1-3',
        name: '初步設計（SD）',
        start: '2025-11-22',
        end: '2025-12-19',
        duration: 28,
        status: 'pending',
        responsible: '建築師事務所',
        deliverables: ['平面配置圖', '立面圖', '3D示意圖'],
        color: '#36a2eb'
      },
      {
        id: 'P1-4',
        name: '細部設計（DD）',
        start: '2025-12-20',
        end: '2026-01-31',
        duration: 43,
        status: 'pending',
        responsible: '建築師 + 機電技師',
        deliverables: ['施工圖', '設備規格', '預算書'],
        color: '#36a2eb'
      },
      {
        id: 'P1-5',
        name: '設計審查',
        start: '2026-02-01',
        end: '2026-02-14',
        duration: 14,
        status: 'pending',
        responsible: '新竹市政府',
        deliverables: ['審查會議紀錄', '修正圖說'],
        color: '#36a2eb'
      }
    ]
  },
  {
    phase: 'Phase 2',
    name: '法規申請階段',
    tasks: [
      {
        id: 'P2-1',
        name: '建築執照申請',
        start: '2026-02-15',
        end: '2026-03-14',
        duration: 28,
        status: 'pending',
        responsible: '建築師事務所',
        deliverables: ['建照核准函'],
        color: '#ffce56'
      },
      {
        id: 'P2-2',
        name: '長照機構設立許可',
        start: '2026-02-15',
        end: '2026-03-07',
        duration: 21,
        status: 'pending',
        responsible: '社會處',
        deliverables: ['設立許可函（實驗性服務）'],
        color: '#ffce56',
        notes: '📋 需依長照服務法第62條申請'
      },
      {
        id: 'P2-3',
        name: '托育機構設立許可',
        start: '2026-02-15',
        end: '2026-03-07',
        duration: 21,
        status: 'pending',
        responsible: '社會處',
        deliverables: ['托育設立許可函'],
        color: '#ffce56'
      }
    ]
  },
  {
    phase: 'Phase 3',
    name: '工程發包階段',
    tasks: [
      {
        id: 'P3-1',
        name: '工程預算編列',
        start: '2026-03-08',
        end: '2026-03-21',
        duration: 14,
        status: 'pending',
        responsible: '社會處',
        deliverables: ['115年度預算書（1.5-2.3億）'],
        color: '#4bc0c0'
      },
      {
        id: 'P3-2',
        name: '工程招標公告',
        start: '2026-03-22',
        end: '2026-04-11',
        duration: 21,
        status: 'pending',
        responsible: '新竹市政府',
        deliverables: ['工程標案公告'],
        color: '#4bc0c0'
      }
    ]
  },
  {
    phase: 'Phase 4',
    name: '人力籌備階段',
    tasks: [
      {
        id: 'P4-1',
        name: '組織架構設計',
        start: '2026-03-01',
        end: '2026-03-14',
        duration: 14,
        status: 'pending',
        responsible: '社會處 + 營運單位',
        deliverables: ['組織架構圖', '職務說明書'],
        color: '#9966ff'
      },
      {
        id: 'P4-2',
        name: '人員招募',
        start: '2026-03-15',
        end: '2026-04-11',
        duration: 28,
        status: 'pending',
        responsible: '營運單位',
        deliverables: ['招募公告', '面試錄取29名'],
        color: '#9966ff'
      },
      {
        id: 'P4-3',
        name: '在職訓練',
        start: '2026-04-12',
        end: '2026-04-25',
        duration: 14,
        status: 'pending',
        responsible: '營運單位',
        deliverables: ['訓練課程紀錄', '證書'],
        color: '#9966ff',
        notes: '💡 跨齡服務訓練、感染控制、緊急應變'
      }
    ]
  },
  {
    phase: 'Phase 5',
    name: '試營運準備',
    tasks: [
      {
        id: 'P5-1',
        name: '設備採購',
        start: '2026-03-22',
        end: '2026-04-18',
        duration: 28,
        status: 'pending',
        responsible: '營運單位',
        deliverables: ['設備清單', '驗收單'],
        color: '#ff9f40'
      },
      {
        id: 'P5-2',
        name: '消防檢查',
        start: '2026-04-19',
        end: '2026-04-25',
        duration: 7,
        status: 'pending',
        responsible: '消防局',
        deliverables: ['消防安全設備檢查合格證明'],
        color: '#ff9f40'
      },
      {
        id: 'P5-3',
        name: '試營運',
        start: '2026-04-26',
        end: '2026-04-30',
        duration: 5,
        status: 'pending',
        responsible: '全體人員',
        deliverables: ['試營運報告', '問題改善清單'],
        color: '#ff9f40'
      }
    ]
  }
];

// 計算甘特圖數據
const startDate = new Date('2025-10-30');
const calculateDayOffset = (dateStr) => {
  const date = new Date(dateStr);
  return Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
};

// 關鍵里程碑
const milestones = [
  {
    name: '🎯 標案決標',
    date: '2025-10-30',
    day: 0,
    importance: 'critical',
    description: '設計監造廠商決定'
  },
  {
    name: '🏗️ 設計審查通過',
    date: '2026-02-14',
    day: calculateDayOffset('2026-02-14'),
    importance: 'high',
    description: '設計圖確定，不可再大幅修改'
  },
  {
    name: '📋 建照核發',
    date: '2026-03-14',
    day: calculateDayOffset('2026-03-14'),
    importance: 'high',
    description: '合法開工許可'
  },
  {
    name: '💰 工程發包',
    date: '2026-04-11',
    day: calculateDayOffset('2026-04-11'),
    importance: 'high',
    description: '工程廠商決定（預算1.5-2.3億）'
  },
  {
    name: '✅ 試營運',
    date: '2026-04-30',
    day: calculateDayOffset('2026-04-30'),
    importance: 'critical',
    description: '正式對外服務前測試'
  }
];

// 甘特圖視覺化組件
export function GanttChart() {
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [selectedPhase, setSelectedPhase] = React.useState(null);

  const totalDays = calculateDayOffset('2026-04-30');
  const weeks = Math.ceil(totalDays / 7);

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    }}>
      <h2 style={{
        color: '#667eea',
        marginBottom: '10px',
        fontSize: '24px',
        textAlign: 'center'
      }}>
        📅 赤土崎全齡社福樞紐 - 6個月實施時程甘特圖
      </h2>

      <p style={{
        textAlign: 'center',
        color: '#666',
        marginBottom: '25px',
        fontSize: '14px'
      }}>
        2025年10月30日（決標）→ 2026年4月30日（試營運）| 總計 {totalDays} 天 ({weeks} 周)
      </p>

      {/* 圖例 */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '10px',
        flexWrap: 'wrap',
        fontSize: '13px'
      }}>
        {implementationPhases.map((phase, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '12px',
              background: phase.tasks[0].color,
              borderRadius: '3px'
            }}/>
            <span>{phase.name}</span>
          </div>
        ))}
      </div>

      {/* 甘特圖主體 */}
      <div style={{ minWidth: '1200px' }}>
        {/* 時間軸表頭 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          marginBottom: '10px'
        }}>
          <div style={{
            fontWeight: 'bold',
            padding: '10px',
            background: '#667eea',
            color: 'white',
            borderRadius: '8px 0 0 8px'
          }}>
            任務名稱
          </div>
          <div style={{
            background: '#667eea',
            color: 'white',
            borderRadius: '0 8px 8px 0',
            display: 'grid',
            gridTemplateColumns: `repeat(${weeks}, 1fr)`,
            textAlign: 'center',
            fontSize: '11px'
          }}>
            {Array.from({ length: weeks }, (_, i) => (
              <div key={i} style={{ padding: '10px 2px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>
                W{i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 任務列表 */}
        {implementationPhases.map((phase, phaseIndex) => (
          <div key={phaseIndex} style={{ marginBottom: '15px' }}>
            {/* Phase 標題 */}
            <div
              onClick={() => setSelectedPhase(selectedPhase === phaseIndex ? null : phaseIndex)}
              style={{
                display: 'grid',
                gridTemplateColumns: '250px 1fr',
                marginBottom: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                fontWeight: 'bold',
                padding: '12px',
                background: phase.tasks[0].color + '33',
                borderLeft: `4px solid ${phase.tasks[0].color}`,
                borderRadius: '6px 0 0 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}>
                <span>{selectedPhase === phaseIndex ? '▼' : '▶'}</span>
                <span>{phase.phase}: {phase.name}</span>
              </div>
              <div style={{
                background: phase.tasks[0].color + '11',
                borderRadius: '0 6px 6px 0'
              }}/>
            </div>

            {/* 任務明細 */}
            {(selectedPhase === null || selectedPhase === phaseIndex) && phase.tasks.map((task, taskIndex) => {
              const startDay = calculateDayOffset(task.start);
              const endDay = calculateDayOffset(task.end);
              const taskWeekStart = Math.floor(startDay / 7);
              const taskWeekEnd = Math.floor(endDay / 7);
              const taskSpan = taskWeekEnd - taskWeekStart + 1;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '250px 1fr',
                    marginBottom: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    padding: '10px 10px 10px 30px',
                    background: selectedTask === task.id ? task.color + '22' : '#f8f9fa',
                    borderRadius: '6px 0 0 6px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    borderLeft: selectedTask === task.id ? `3px solid ${task.color}` : 'none'
                  }}>
                    {task.name}
                  </div>

                  <div style={{
                    background: '#f8f9fa',
                    borderRadius: '0 6px 6px 0',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${weeks}, 1fr)`,
                    position: 'relative'
                  }}>
                    {/* 甘特條 */}
                    <div style={{
                      position: 'absolute',
                      left: `${(taskWeekStart / weeks) * 100}%`,
                      width: `${(taskSpan / weeks) * 100}%`,
                      height: '70%',
                      top: '15%',
                      background: `linear-gradient(90deg, ${task.color}dd, ${task.color})`,
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      padding: '0 8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {task.duration}天
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 選中任務的詳細資訊 */}
            {selectedTask && phase.tasks.find(t => t.id === selectedTask) && (
              <div style={{
                marginTop: '10px',
                padding: '15px',
                background: '#e3f2fd',
                borderRadius: '8px',
                border: '2px solid #2196f3',
                fontSize: '13px',
                lineHeight: '1.8'
              }}>
                {(() => {
                  const task = phase.tasks.find(t => t.id === selectedTask);
                  return (
                    <>
                      <div style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#1565c0', fontSize: '15px' }}>{task.name}</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                        <div>
                          <strong>📅 起訖日期：</strong>{task.start} ~ {task.end}
                        </div>
                        <div>
                          <strong>⏱️ 工期：</strong>{task.duration} 天
                        </div>
                        <div>
                          <strong>👤 負責單位：</strong>{task.responsible}
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <strong>📦 交付成果：</strong>
                        <ul style={{ margin: '5px 0 0 20px', paddingLeft: 0 }}>
                          {task.deliverables.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      {task.notes && (
                        <div style={{
                          marginTop: '10px',
                          padding: '10px',
                          background: '#fff3cd',
                          borderRadius: '6px',
                          color: '#856404'
                        }}>
                          <strong>💡 備註：</strong>{task.notes}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        ))}

        {/* 里程碑標記 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #ddd'
        }}>
          <div style={{
            fontWeight: 'bold',
            padding: '10px',
            fontSize: '14px'
          }}>
            關鍵里程碑
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${weeks}, 1fr)`,
            position: 'relative'
          }}>
            {milestones.map((milestone, index) => {
              const week = Math.floor(milestone.day / 7);
              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${(week / weeks) * 100}%`,
                    top: 0,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div style={{
                    width: '3px',
                    height: '40px',
                    background: milestone.importance === 'critical' ? '#f44336' : '#ff9800',
                    marginBottom: '5px'
                  }}/>
                  <div style={{
                    background: milestone.importance === 'critical' ? '#f44336' : '#ff9800',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    {milestone.name}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#999',
                    marginTop: '3px',
                    textAlign: 'center'
                  }}>
                    {milestone.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 操作提示 */}
      <div style={{
        marginTop: '25px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        💡 <strong>互動提示：</strong>點擊 Phase 標題展開/收合 | 點擊任務列查看詳細資訊 | W1 = 第1周（從10/30起算）
      </div>

      {/* 關鍵洞察 */}
      <div style={{
        marginTop: '25px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
          💡 時程關鍵洞察
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '15px',
          fontSize: '13px',
          lineHeight: '1.8'
        }}>
          <div>
            <strong>🔥 黃金窗口（11/8-11/28）：</strong><br/>
            使用者需求訪談階段，是影響功能設計的最後機會！黑客松提案應在此期間提交給建築師參考。
          </div>
          <div>
            <strong>⚠️ 設計審查（2/14前）：</strong><br/>
            審查通過後無法大幅修改，「分時共享、跨齡互助」的空間設計必須在此前定案（STC 65隔音、IIC 70地板）。
          </div>
          <div>
            <strong>📋 平行法規申請：</strong><br/>
            建照、長照許可、托育許可同步進行（2/15-3/14），需協調衛福部、新竹市府、建管處三方。
          </div>
          <div>
            <strong>💰 預算編列時程：</strong><br/>
            工程預算1.5-2.3億需納入115年度預算（3/8-3/21），若延遲可能影響116年才能開工。
          </div>
        </div>
      </div>
    </div>
  );
}

// 里程碑時間表組件
export function MilestoneTimeline() {
  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      marginTop: '30px'
    }}>
      <h2 style={{
        color: '#667eea',
        marginBottom: '25px',
        fontSize: '22px',
        textAlign: 'center'
      }}>
        🎯 關鍵里程碑時間表
      </h2>

      <div style={{ position: 'relative', paddingLeft: '40px' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '20px',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'linear-gradient(to bottom, #667eea, #764ba2)'
        }}/>

        {milestones.map((milestone, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              marginBottom: '30px',
              paddingLeft: '30px'
            }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '8px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: milestone.importance === 'critical' ? '#f44336' : '#ff9800',
              boxShadow: `0 0 0 6px white, 0 0 0 8px ${milestone.importance === 'critical' ? '#f44336' : '#ff9800'}55`
            }}/>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              border: `3px solid ${milestone.importance === 'critical' ? '#f44336' : '#ff9800'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: milestone.importance === 'critical' ? '#f44336' : '#ff9800' }}>
                  {milestone.name}
                </h3>
                <div style={{
                  background: milestone.importance === 'critical' ? '#f44336' : '#ff9800',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  {milestone.date}
                </div>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {milestone.description}
              </p>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                第 {milestone.day} 天 | 第 {Math.floor(milestone.day / 7) + 1} 周
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 完整實施時程組件
export function CompleteImplementationTimeline() {
  return (
    <div>
      <GanttChart />
      <MilestoneTimeline />

      {/* 風險與對策 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '20px', fontSize: '22px' }}>
          ⚠️ 時程風險與對策
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            background: '#ffebee',
            borderRadius: '12px',
            border: '2px solid #f44336'
          }}>
            <h3 style={{ color: '#c62828', marginBottom: '12px', fontSize: '16px' }}>
              🚨 高風險：設計需求變更
            </h3>
            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
              <strong>風險：</strong>使用者需求訪談階段（11/8-11/28）若未充分溝通，後續設計變更將延遲時程<br/>
              <strong>影響：</strong>延遲2-4周<br/>
              <strong>對策：</strong>
              <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                <li>黑客松團隊積極參與需求訪談</li>
                <li>提供完整「分時共享、跨齡互助」設計方案</li>
                <li>準備國際案例佐證（日本、荷蘭）</li>
              </ul>
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: '#fff3e0',
            borderRadius: '12px',
            border: '2px solid #ff9800'
          }}>
            <h3 style={{ color: '#e65100', marginBottom: '12px', fontSize: '16px' }}>
              ⚠️ 中風險：法規審查延遲
            </h3>
            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
              <strong>風險：</strong>建照、長照許可、托育許可三項法規需平行審查，任一延遲將影響後續<br/>
              <strong>影響：</strong>延遲1-3周<br/>
              <strong>對策：</strong>
              <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                <li>提前與各單位溝通整合型服務模式</li>
                <li>依長照服務法第62條申請「實驗性服務」</li>
                <li>準備完整風險評估報告（感染控制、動線分流）</li>
              </ul>
            </div>
          </div>

          <div style={{
            padding: '20px',
            background: '#e8f5e9',
            borderRadius: '12px',
            border: '2px solid #4caf50'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '12px', fontSize: '16px' }}>
              ✅ 低風險：人力招募
            </h3>
            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.8' }}>
              <strong>風險：</strong>29名人員招募可能因待遇、資格限制而困難<br/>
              <strong>影響：</strong>延遲1-2周<br/>
              <strong>對策：</strong>
              <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                <li>提前4個月公告（3/15開始招募）</li>
                <li>與長照協會、托育協會合作推薦</li>
                <li>提供有競爭力的薪資（參考市場行情+10%）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mermaid 代碼 */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginBottom: '15px', fontSize: '22px' }}>
          💻 Mermaid 甘特圖代碼
        </h2>

        <div style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '11px',
          overflowX: 'auto'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`\`\`\`mermaid
gantt
    title 赤土崎全齡社福樞紐 - 6個月實施時程
    dateFormat  YYYY-MM-DD
    section 標案決標
    開標評選           :crit, p0-1, 2025-10-30, 8d

    section 規劃設計
    基地現況調查       :active, p1-1, 2025-11-08, 14d
    使用者需求訪談     :active, p1-2, 2025-11-08, 21d
    初步設計(SD)       :p1-3, 2025-11-22, 28d
    細部設計(DD)       :p1-4, 2025-12-20, 43d
    設計審查           :p1-5, 2026-02-01, 14d

    section 法規申請
    建築執照申請       :p2-1, 2026-02-15, 28d
    長照機構設立許可   :p2-2, 2026-02-15, 21d
    托育機構設立許可   :p2-3, 2026-02-15, 21d

    section 工程發包
    工程預算編列       :p3-1, 2026-03-08, 14d
    工程招標公告       :p3-2, 2026-03-22, 21d

    section 人力籌備
    組織架構設計       :p4-1, 2026-03-01, 14d
    人員招募           :p4-2, 2026-03-15, 28d
    在職訓練           :p4-3, 2026-04-12, 14d

    section 試營運準備
    設備採購           :p5-1, 2026-03-22, 28d
    消防檢查           :p5-2, 2026-04-19, 7d
    試營運             :crit, p5-3, 2026-04-26, 5d
\`\`\`
`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CompleteImplementationTimeline;
