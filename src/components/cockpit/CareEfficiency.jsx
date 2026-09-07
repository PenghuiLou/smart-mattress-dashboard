// src/components/cockpit/CareEfficiency.jsx
/** 底部 - 护理响应效率（今日/近7日切换，两行网格布局充分利用空间） */
import React from 'react'
import { Clock, UserCheck, BarChart3, Bell, Share2 } from 'lucide-react'

const FIELDS = [
  { key: 'avgConfirm', label: '平均确认时间', icon: Clock },
  { key: 'avgArrival', label: '平均到场时间', icon: UserCheck },
  { key: 'closureRate', label: '告警闭环率', icon: BarChart3 },
  { key: 'overdue', label: '超时未处理', icon: Bell },
  { key: 'transfers', label: '今日转派次数', icon: Share2 },
]

export default function CareEfficiency({ metrics }) {
  const [range, setRange] = React.useState('today')

  const values = {
    today: {
      avgConfirm: metrics.avgResponseText,
      avgArrival: '5分40秒',
      closureRate: `${metrics.closureRate.toFixed(1)}%`,
      overdue: `${metrics.overdueAlerts} 条`,
      transfers: `${metrics.transferredAlerts} 次`,
    },
    week: {
      avgConfirm: '3分05秒',
      avgArrival: '6分12秒',
      closureRate: '86.4%',
      overdue: '3 条',
      transfers: '11 次',
    },
  }

  const v = values[range]
  return (
    <div className="cockpit-panel rounded-2xl p-4 h-[260px] shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-[#e9f7f8]">护理响应效率</div>
        <div className="flex gap-1 bg-[#04121f] rounded-lg p-1">
          <button
            onClick={() => setRange('today')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${range === 'today' ? 'bg-[#55d6d2] text-[#04121f] font-medium' : 'text-[#91b4c1] hover:text-[#e9f7f8]'}`}
          >
            今日
          </button>
          <button
            onClick={() => setRange('week')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${range === 'week' ? 'bg-[#55d6d2] text-[#04121f] font-medium' : 'text-[#91b4c1] hover:text-[#e9f7f8]'}`}
          >
            近7日
          </button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-5 gap-2">
        {FIELDS.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.key}
              className="flex flex-col items-center justify-center rounded-xl bg-[#04121f]/50 border border-[rgba(117,206,220,0.08)] px-2"
            >
              <div className="flex items-center justify-center gap-1 text-[#91b4c1] text-xs mb-1 whitespace-nowrap">
                <Icon size={12} className="shrink-0" />
                {f.label}
              </div>
              <div className="font-medium text-lg text-[#e9f7f8] whitespace-nowrap">{v[f.key]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
