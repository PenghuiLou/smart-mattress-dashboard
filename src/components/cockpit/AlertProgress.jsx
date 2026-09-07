// src/components/cockpit/AlertProgress.jsx
/** 右列 - 告警处置进度（堆叠条 + 超时强调） */
import React from 'react'
import { CheckCircle, Clock, Share2, XCircle, TrendingUp } from 'lucide-react'
import { ALERT_RULES } from '../../data/mockData'

const SEG = [
  { key: 'pending', label: '待确认', color: '#f2b35b', icon: Clock },
  { key: 'processing', label: '处理中', color: '#5ba7e8', icon: TrendingUp },
  { key: 'closed', label: '已归档', color: '#63d19b', icon: CheckCircle },
]

export default function AlertProgress({ alerts = [], metrics }) {
  const counts = { pending: 0, processing: 0, closed: 0 }
  let overdue = 0
  alerts.forEach((a) => {
    if (a.status === 'transferred') counts.processing += 1
    else if (counts[a.status] !== undefined) counts[a.status] += 1
    if (['pending', 'processing', 'transferred'].includes(a.status)) {
      if ((Date.now() - Date.parse(a.triggeredAt)) / 60000 > ALERT_RULES.overdueMinutes) overdue += 1
    }
  })

  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
  const pct = (k) => (counts[k] / total) * 100

  return (
    <div className="cockpit-panel rounded-2xl p-4 h-[240px] flex flex-col">
      <div className="text-sm font-medium text-[#e9f7f8] mb-3">告警处置进度</div>
      <div className="flex-1">
        <div className="relative h-7 rounded-lg overflow-hidden bg-[#04121f]/60 flex">
          {SEG.map((s) => {
            const w = pct(s.key)
            if (!w) return null
            return (
              <div key={s.key} className="h-full flex items-center" style={{ width: `${w}%`, background: s.color }} title={`${s.label}: ${counts[s.key]}`} />
            )
          })}
        </div>
        <div className="mt-3 space-y-2">
          {SEG.map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <span className="text-xs text-[#91b4c1] flex items-center gap-2">
                <s.icon size={12} style={{ color: s.color }} />
                {s.label}
              </span>
              <span className="text-[#e9f7f8]">{counts[s.key]} 条</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1 border-t border-[rgba(117,206,220,0.1)]">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2">
              <XCircle size={12} className="text-[#ee716b]" />
              超时未处理
            </span>
            <span className="text-[#ee716b] font-medium">{overdue} 条</span>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#62818e] mt-1">
        今日告警 {metrics.todayAlerts} 条 · 闭环率 {metrics.closureRate.toFixed(1)}%
      </div>
    </div>
  )
}
