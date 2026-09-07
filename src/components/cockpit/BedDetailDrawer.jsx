// src/components/cockpit/BedDetailDrawer.jsx
/** 床位详情抽屉：从右滑出，含设备/状态/心率·呼吸趋势/离床摘要/最近告警 */
import React from 'react'
import { X, Wifi, WifiOff, Wind, HeartPulse, Clock, Bell, ChevronRight } from 'lucide-react'
import { BED_STATUS, ALERT_TYPE_LABELS, maskName, ALERT_TYPE_COLORS } from '../../data/mockData'
import TrendChart from './TrendChart'

function makeRng(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return (((t ^ (t >>> 14)) >>> 0) % 10000) / 10000
  }
}

function buildSeries(base, rng, count = 24) {
  const arr = []
  let cur = base
  for (let i = 0; i < count; i++) {
    cur += (rng() - 0.5) * 4
    arr.push({ hour: `${String((24 - count + i) % 24).padStart(2, '0')}:00`, value: Math.round(cur) })
  }
  return arr
}

export default function BedDetailDrawer({ bed, open, onClose, alerts = [], onAlertSelect }) {
  if (!open || !bed) return null

  const offline = bed.deviceStatus === 'offline'
  const st = BED_STATUS[bed.bedStatus] || { label: bed.bedStatus, color: '#55d6d2' }

  const rng = makeRng(Date.now() + bed.id.charCodeAt(0) * 7)
  const hrSeries = bed.heartRate ? buildSeries(bed.heartRate, rng) : []
  const rrSeries = bed.respirationRate ? buildSeries(bed.respirationRate, rng) : []

  const recentAlerts = (alerts || []).filter((a) => a.room === bed.room && a.floor === bed.floor).slice(0, 3)

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-[420px] h-full cockpit-panel rounded-l-2xl overflow-y-auto cockpit-scrollbar m-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(117,206,220,0.18)]">
          <div className="text-lg font-medium text-[#e9f7f8]">{bed.room}-{bed.bed} 床位详情</div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#62818e] hover:text-[#e9f7f8] hover:bg-[#12334a]">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#91b4c1]">老人姓名</div>
              <div className="text-[#e9f7f8] font-medium">{maskName(bed.elderName)}</div>
            </div>
            <div>
              <div className="text-xs text-[#91b4c1]">责任护工</div>
              <div className="text-[#e9f7f8] font-medium">{bed.caregiver}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div><span className="text-[#62818e]">所属位置：</span><span className="text-[#e9f7f8]">{bed.building} {bed.floor} {bed.room}室</span></div>
            <div><span className="text-[#62818e]">设备编号：</span><span className="text-[#e9f7f8]">{bed.deviceId}</span></div>
            <div>
              <span className="text-[#62818e]">设备状态：</span>
              <span className="inline-flex items-center gap-1" style={{ color: offline ? '#62818e' : '#63d19b' }}>
                {offline ? <WifiOff size={12} /> : <Wifi size={12} />}
                {offline ? '离线' : '在线'}
              </span>
            </div>
            <div><span className="text-[#62818e]">信号质量：</span><span className="text-[#e9f7f8]">{bed.signalQuality}</span></div>
            <div><span className="text-[#62818e]">当前状态：</span><span style={{ color: st.color }}>{st.label}</span></div>
            <div><span className="text-[#62818e]">最后上报：</span><span className="text-[#e9f7f8]">{bed.lastUpdate}</span></div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-[#91b4c1] mb-1 flex items-center gap-1">
              <HeartPulse size={12} className="text-[#ee716b]" />
              <span>心率（次/分）</span>
              <span className="text-[#62818e]">（演示数据）</span>
            </div>
            {offline ? (
              <div className="text-[#62818e] text-xs py-4">暂无有效数据</div>
            ) : (
              <TrendChart variant="line" data={hrSeries} xKey="hour" series={[{ key: 'value', color: '#ee716b', name: '心率' }]} height={90} />
            )}
          </div>

          <div className="pt-2">
            <div className="text-xs text-[#91b4c1] mb-1 flex items-center gap-1">
              <Wind size={12} className="text-[#9e8bea]" />
              <span>呼吸（次/分）</span>
              <span className="text-[#62818e]">（演示数据）</span>
            </div>
            {offline ? (
              <div className="text-[#62818e] text-xs py-4">暂无有效数据</div>
            ) : (
              <TrendChart variant="line" data={rrSeries} xKey="hour" series={[{ key: 'value', color: '#9e8bea', name: '呼吸' }]} height={90} />
            )}
          </div>

          <div className="pt-2">
            <div className="text-xs text-[#91b4c1] mb-2 flex items-center gap-1">
              <Clock size={12} />
              <span>最近 24 小时离床体动摘要</span>
            </div>
            <div className="text-xs text-[#62818e] space-y-1">
              <div>• 离床 3 次，累计 52 分钟</div>
              <div>• 体动强度评估：中等</div>
              <div>• 平均休息片段 78 分钟/次</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-[#91b4c1] mb-2 flex items-center gap-1">
              <Bell size={12} />
              <span>最近告警</span>
            </div>
            {recentAlerts.length === 0 ? (
              <div className="text-xs text-[#62818e]">暂无告警</div>
            ) : (
              <div className="space-y-2">
                {recentAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between text-xs cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAlertSelect && onAlertSelect(a)
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ALERT_TYPE_COLORS[a.type] }} />
                      <span>{ALERT_TYPE_LABELS[a.type]}</span>
                    </div>
                    <ChevronRight size={12} className="text-[#62818e]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-t border-[rgba(117,206,220,0.12)] text-[10px] text-[#62818e]">
          * 心率/呼吸为床垫采集的演示数据，仅供照护参考，不构成医疗诊断。
        </div>
      </div>
    </div>
  )
}
