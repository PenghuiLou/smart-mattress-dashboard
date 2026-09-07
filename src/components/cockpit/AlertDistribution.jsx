// src/components/cockpit/AlertDistribution.jsx
/** 左列 - 今日告警类型分布（自绘横向条，条末显示数值） */
import React from 'react'

const ITEMS = [
  { key: 'out_of_bed', label: '离床未归', color: '#f2b35b' },
  { key: 'heart_rate', label: '心率异常', color: '#ee716b' },
  { key: 'respiration', label: '呼吸异常', color: '#9e8bea' },
]

export default function AlertDistribution({ alerts = [] }) {
  const counts = {}
  alerts.forEach((a) => {
    counts[a.type] = (counts[a.type] || 0) + 1
  })
  const data = ITEMS.map((it) => ({ ...it, value: counts[it.key] || 0 }))
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="cockpit-panel rounded-2xl p-5 h-[170px] flex flex-col">
      <div className="text-sm font-medium text-[#e9f7f8] mb-3">今日告警类型分布</div>
      <div className="flex-1 flex flex-col justify-center gap-4">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-3">
            <span className="w-16 text-xs text-[#91b4c1] shrink-0">{d.label}</span>
            <div className="flex-1 h-3 rounded bg-[#04121f]/60 overflow-hidden">
              <div
                className="h-full rounded"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color, minHeight: d.value ? 12 : 0 }}
              />
            </div>
            <span className="w-8 text-right text-xs font-medium shrink-0" style={{ color: d.color }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}