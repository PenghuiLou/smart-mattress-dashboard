// src/components/cockpit/RiskOverview.jsx
/** 左列 - 风险概览：监测状态环形 + 三类人数 */
import React from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import TrendChart from './TrendChart'

export default function RiskOverview({ metrics }) {
  const { monitoringNormal, attentionElders, pendingReview } = metrics
  const pieData = [
    { name: '正常监测', value: monitoringNormal, color: '#63d19b' },
    { name: '需要关注', value: attentionElders, color: '#f2b35b' },
    { name: '待人工确认', value: pendingReview, color: '#ff8c42' },
  ]
  const pieSeries = pieData.map((d) => ({ color: d.color }))

  return (
    <div className="cockpit-panel rounded-2xl p-5 h-[200px] flex flex-col">
      <div className="text-sm font-medium text-[#e9f7f8] mb-2">风险概览</div>
      <div className="flex-1 flex items-center gap-6">
        <div className="w-[140px] h-[140px] shrink-0">
          <TrendChart variant="pie" data={pieData} series={pieSeries} height={140} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2">
              <CheckCircle size={12} className="text-[#63d19b]" />正常监测
            </span>
            <span className="text-[#63d19b] font-medium">{monitoringNormal} 人</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2">
              <AlertCircle size={12} className="text-[#f2b35b]" />需要关注
            </span>
            <span className="text-[#f2b35b] font-medium">{attentionElders} 人</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#91b4c1] flex items-center gap-2">
              <AlertCircle size={12} className="text-[#ff8c42]" />待人工确认
            </span>
            <span className="text-[#ff8c42] font-medium">{pendingReview} 人</span>
          </div>
        </div>
      </div>
    </div>
  )
}
