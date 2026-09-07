// src/components/cockpit/DeviceTrend.jsx
/** 底部 - 设备运行趋势（在线率 24h） + 离线/信号不足统计 */
import React from 'react'
import { Wifi, WifiOff, Signal } from 'lucide-react'
import TrendChart from './TrendChart'

export default function DeviceTrend({ data, metrics }) {
  const series = [{ key: 'rate', color: '#63d19b', name: '在线率' }]
  const offlineDevices = metrics.deviceTotal - metrics.deviceOnline
  const poor = (data.beds || []).filter((b) => b.signalQuality === 'poor').length

  return (
    <div className="cockpit-panel rounded-2xl p-4 h-[220px] flex flex-col">
      <div className="text-sm font-medium text-[#e9f7f8] mb-3">设备运行趋势</div>
      <div className="flex-1">
        <TrendChart variant="line" data={data.deviceTrend24h || []} xKey="hour" series={series} height={150} />
      </div>
      <div className="mt-1 flex items-center justify-center gap-5 text-xs">
        <span className="text-[#63d19b] flex items-center gap-1"><Wifi size={12} />在线 {metrics.deviceOnline} 台</span>
        <span className="text-[#ee716b] flex items-center gap-1"><WifiOff size={12} />离线 {offlineDevices} 台</span>
        <span className="text-[#f2b35b] flex items-center gap-1"><Signal size={12} />信号弱 {poor} 台</span>
      </div>
    </div>
  )
}
