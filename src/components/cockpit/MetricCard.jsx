// src/components/cockpit/MetricCard.jsx
/** 指标卡片：名称 + 主值 + 单位 + 较昨日变化 + 迷你趋势线 + 风险突出 */
import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import TrendChart from './TrendChart'

const TONE = {
  cyan: { text: '#e9f7f8', sub: '#91b4c1', icon: '#55d6d2' },
  green: { text: '#e9f7f8', sub: '#91b4c1', icon: '#63d19b' },
  blue: { text: '#e9f7f8', sub: '#91b4c1', icon: '#5ba7e8' },
  amber: { text: '#e9f7f8', sub: '#91b4c1', icon: '#f2b35b' },
  red: { text: '#e9f7f8', sub: '#91b4c1', icon: '#ee716b' },
}

export default function MetricCard({ title, value, unit, change, trend, tone = 'cyan', icon: Icon, urgent = false, miniTrend }) {
  const t = TONE[tone] || TONE.cyan
  const showTrend = Number.isFinite(change) && change !== 0
  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const color = trend === 'up' ? '#ee716b' : trend === 'down' ? '#63d19b' : '#62818e'
  const series = [{ key: 'v', color: t.icon }]
  const miniData = (miniTrend || []).map((v, i) => ({ v: v ?? 0, t: i }))

  return (
    <div
      className={`relative rounded-2xl p-4 flex flex-col transition-all ${urgent ? 'border border-[#ee716b]/40' : 'border border-[rgba(117,206,220,0.12)] bg-[#12334a]/40'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#55d6d2]" />
          <span className="text-xs text-[#91b4c1]">{title}</span>
        </div>
        {urgent && <span className="text-[10px] text-[#ee716b] bg-[#ee716b]/15 px-1.5 py-0.5 rounded">风险</span>}
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold" style={{ color: t.text }}>
          {value}
        </span>
        {unit && <span className="text-sm text-[#91b4c1]" style={{ color: t.sub }}>{unit}</span>}
        {showTrend && (
          <span className="flex items-center gap-0.5 text-xs" style={{ color }}>
            {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
            <span>{change > 0 ? `+${change}` : change}</span>
          </span>
        )}
      </div>

      {miniData.length > 0 && (
        <div className="mt-1 h-[20px]">
          <TrendChart variant="line" data={miniData} xKey="t" series={series} height={20} hideYAxis hideXAxis />
        </div>
      )}
    </div>
  )
}
