// src/components/cockpit/AlertTrend7d.jsx
/** 底部 - 近 7 日告警趋势（按类型着色折线） */
import React from 'react'
import { ALERT_TYPE_COLORS } from '../../data/mockData'
import TrendChart from './TrendChart'

const SERIES = [
  { key: 'out_of_bed', color: ALERT_TYPE_COLORS.out_of_bed, name: '离床' },
  { key: 'heart_rate', color: ALERT_TYPE_COLORS.heart_rate, name: '心率' },
  { key: 'respiration', color: ALERT_TYPE_COLORS.respiration, name: '呼吸' },
  { key: 'device', color: ALERT_TYPE_COLORS.device_offline, name: '设备' },
]

export default function AlertTrend7d({ trend7d = [] }) {
  return (
    <div className="cockpit-panel rounded-2xl p-4 h-[260px] shrink-0 flex flex-col">
      <div className="text-sm font-medium text-[#e9f7f8] mb-2">近 7 日告警趋势</div>
      <div className="h-[210px]">
        <TrendChart variant="line-multi" data={trend7d} xKey="date" series={SERIES} height={210} />
      </div>
    </div>
  )
}
