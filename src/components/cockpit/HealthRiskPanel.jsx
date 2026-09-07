// src/components/cockpit/HealthRiskPanel.jsx
/** 底部 - 健康监测风险分布（心率/呼吸监测状态与风险提示人数） */
import React from 'react'
import { HeartPulse, Wind } from 'lucide-react'
import TrendChart from './TrendChart'

export default function HealthRiskPanel({ metrics }) {
  const pieData = [
    { name: '心率监测正常', value: metrics.heartOk, color: '#63d19b' },
    { name: '呼吸监测正常', value: metrics.respOk, color: '#5ba7e8' },
    { name: '心率风险提示', value: metrics.heartRisk, color: '#ee716b' },
    { name: '呼吸风险提示', value: metrics.respRisk, color: '#9e8bea' },
  ]
  const series = pieData.map((d) => ({ color: d.color }))

  return (
    <div className="cockpit-panel rounded-2xl p-4 h-[200px] flex flex-col">
      <div className="text-sm font-medium text-[#e9f7f8] mb-3">健康监测风险分布</div>
      <div className="flex-1 flex items-center gap-4">
        <div className="w-36 h-36 shrink-0">
          <TrendChart variant="pie" data={pieData} series={series} height={140} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2"><HeartPulse size={12} className="text-[#ee716b]" />心率监测正常</span>
            <span className="text-[#63d19b]">{metrics.heartOk} 人</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2"><Wind size={12} className="text-[#9e8bea]" />呼吸监测正常</span>
            <span className="text-[#5ba7e8]">{metrics.respOk} 人</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2"><HeartPulse size={12} className="text-[#ee716b]" />心率风险提示</span>
            <span className="text-[#ee716b]">{metrics.heartRisk} 人</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2"><Wind size={12} className="text-[#9e8bea]" />呼吸风险提示</span>
            <span className="text-[#9e8bea]">{metrics.respRisk} 人</span>
          </div>
        </div>
      </div>
    </div>
  )
}
