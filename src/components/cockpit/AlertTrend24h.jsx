// src/components/cockpit/AlertTrend24h.jsx
/** 左列 - 近 24 小时告警趋势（可按类型切换） */
import React from 'react'
import { ALERT_TYPE_COLORS } from '../../data/mockData'
import TrendChart from './TrendChart'

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'out_of_bed', label: '离床' },
  { key: 'heart_rate', label: '心率' },
  { key: 'respiration', label: '呼吸' },
  { key: 'device', label: '设备' },
]

export default function AlertTrend24h({ trend24h = [] }) {
  const [tab, setTab] = React.useState('all')

  const seriesMap = {
    all: [{ key: 'total', color: '#55d6d2', name: '全部' }],
    out_of_bed: [{ key: 'out_of_bed', color: ALERT_TYPE_COLORS.out_of_bed, name: '离床' }],
    heart_rate: [{ key: 'heart_rate', color: ALERT_TYPE_COLORS.heart_rate, name: '心率' }],
    respiration: [{ key: 'respiration', color: ALERT_TYPE_COLORS.respiration, name: '呼吸' }],
    device: [{ key: 'device', color: ALERT_TYPE_COLORS.device_offline, name: '设备' }],
  }

  return (
    <div className="cockpit-panel rounded-2xl p-4 h-[260px] shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-[#e9f7f8]">近 24 小时告警趋势</div>
        <div className="flex gap-1 bg-[#04121f] rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                tab === t.key ? 'bg-[#55d6d2] text-[#04121f] font-medium' : 'text-[#91b4c1] hover:text-[#e9f7f8]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[210px]">
        <TrendChart variant="line" data={trend24h} xKey="hour" series={seriesMap[tab]} height={210} />
      </div>
    </div>
  )
}
