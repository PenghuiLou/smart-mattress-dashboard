// src/pages/Cockpit.jsx
/**
 * 智能床垫监测驾驶舱 - 主页面
 * 布局（1920×1080）：
 *  顶部标题 | 7 个核心指标 | 左/中/右三列主体 | 底部趋势 | 页脚声明
 */
import React from 'react'
import '../dashboard.css'
import { BedDouble, Wifi, Users, AlertCircle, BellRing, BarChart3, Clock } from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'
import CockpitHeader from '../components/cockpit/CockpitHeader'
import MetricCard from '../components/cockpit/MetricCard'
import RiskOverview from '../components/cockpit/RiskOverview'
import AlertDistribution from '../components/cockpit/AlertDistribution'
import BedMap from '../components/cockpit/BedMap'
import BedDetailDrawer from '../components/cockpit/BedDetailDrawer'
import AlertCenter from '../components/cockpit/AlertCenter'
import AlertProgress from '../components/cockpit/AlertProgress'
import AlertDetailModal from '../components/cockpit/AlertDetailModal'
import HealthRiskPanel from '../components/cockpit/HealthRiskPanel'
import CareEfficiency from '../components/cockpit/CareEfficiency'
import AlertTrend24h from '../components/cockpit/AlertTrend24h'
import AlertTrend7d from '../components/cockpit/AlertTrend7d'

export default function Cockpit() {
  const { data, metrics, changes, refreshing, refresh, updateAlert } = useDashboardData()

  const [bedDrawerOpen, setBedDrawerOpen] = React.useState(false)
  const [selectedBed, setSelectedBed] = React.useState(null)
  const [alertModalOpen, setAlertModalOpen] = React.useState(false)
  const [selectedAlert, setSelectedAlert] = React.useState(null)

  const openBed = (bed) => { setSelectedBed(bed); setBedDrawerOpen(true) }
  const openAlert = (alert) => { setSelectedAlert(alert); setAlertModalOpen(true) }

  const trendOf = (k) => {
    const d = changes[k]
    if (d > 0.0001) return 'up'
    if (d < -0.0001) return 'down'
    return undefined
  }

  const metricCards = [
    { title: '监测床位', value: metrics.bedTotal, unit: '张', change: changes.bedTotal, trend: trendOf('bedTotal'), tone: 'cyan', icon: BedDouble },
    { title: '设备在线率', value: `${metrics.deviceOnlineRate.toFixed(1)}%`, change: changes.deviceOnlineRate, trend: trendOf('deviceOnlineRate'), tone: 'cyan', icon: Wifi },
    { title: '当前在床', value: metrics.inBed, unit: '人', change: changes.inBed, trend: trendOf('inBed'), tone: 'green', icon: Users },
    { title: '离床未归', value: metrics.outOfBedUnreturned, unit: '人', change: changes.outOfBedUnreturned, trend: trendOf('outOfBedUnreturned'), tone: 'red', icon: AlertCircle, urgent: true },
    { title: '待处理告警', value: metrics.pendingAlerts, unit: '条', change: changes.pendingAlerts, trend: trendOf('pendingAlerts'), tone: 'red', icon: BellRing, urgent: true },
    { title: '今日告警', value: metrics.todayAlerts, unit: '条', change: changes.todayAlerts, trend: trendOf('todayAlerts'), tone: 'amber', icon: BarChart3 },
    { title: '平均响应', value: metrics.avgResponseText, change: changes.avgResponseMinutes, trend: trendOf('avgResponseMinutes'), tone: 'blue', icon: Clock },
  ]

  return (
    <div className="cockpit-root cockpit-page min-h-screen text-[#e9f7f8] font-sans overflow-hidden flex flex-col">
      {refreshing && <div className="fixed top-0 left-0 right-0 h-0.5 bg-[#55d6d2] animate-pulse z-50" />}
      <CockpitHeader lastUpdate={data.lastUpdate} refreshing={refreshing} onRefresh={refresh} />
      <div className="grid grid-cols-7 gap-3 px-4 py-3">
        {metricCards.map((c) => <MetricCard key={c.title} {...c} />)}
      </div>
      <div className="flex-1 flex gap-4 px-4 pb-4 overflow-hidden">
        <div className="w-[24%] min-w-[230px] flex flex-col gap-3 overflow-y-auto cockpit-scrollbar">
          <RiskOverview metrics={metrics} />
          <AlertDistribution alerts={data.alerts} />
          <HealthRiskPanel metrics={metrics} />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <BedMap beds={data.beds} onBedClick={openBed} />
        </div>
        <div className="w-[26%] min-w-[280px] flex flex-col gap-4 overflow-y-auto cockpit-scrollbar">
          <AlertCenter alerts={data.alerts} onSelect={openAlert} onUpdate={updateAlert} />
          <AlertProgress alerts={data.alerts} metrics={metrics} />
        </div>
      </div>
      <div className="flex gap-3 px-4 pb-4">
        <div className="w-[30%] shrink-0">
          <AlertTrend24h trend24h={data.trend24h} />
        </div>
        <div className="w-[30%] shrink-0">
          <AlertTrend7d trend7d={data.trend7d} />
        </div>
        <div className="flex-1 min-w-0">
          <CareEfficiency metrics={metrics} />
        </div>
      </div>
      <div className="px-4 py-2 text-[11px] text-[#62818e] text-center border-t border-[rgba(117,206,220,0.12)]">
        <span className="text-[#f2b35b]">●</span> 床垫监测为演示数据，仅供照护参考，不构成医疗诊断。
      </div>
      <BedDetailDrawer bed={selectedBed} open={bedDrawerOpen} onClose={() => setBedDrawerOpen(false)} alerts={data.alerts} onAlertSelect={openAlert} />
      <AlertDetailModal alert={selectedAlert} open={alertModalOpen} onClose={() => setAlertModalOpen(false)} onUpdate={updateAlert} />
    </div>
  )
}
