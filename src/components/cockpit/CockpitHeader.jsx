// src/components/cockpit/CockpitHeader.jsx
/** 顶部标题区：机构名称 + 驾驶舱名称 + 当前时间/更新时间 + 刷新 + 全屏 */
import React from 'react'
import { RefreshCw, Maximize2, Building2, Clock } from 'lucide-react'

export default function CockpitHeader({ lastUpdate, refreshing, onRefresh }) {
  const [now, setNow] = React.useState(new Date())
  const [fullscreen, setFullscreen] = React.useState(false)

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const toggleFullscreen = () => {
    const el = document.querySelector('.cockpit-root')
    if (!fullscreen) {
      if (el.requestFullscreen) el.requestFullscreen()
      else el.webkitRequestFullscreen()
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
      else document.webkitExitFullscreen()
    }
    setFullscreen(!fullscreen)
  }

  const pad = (n) => String(n).padStart(2, '0')
  const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-[rgba(117,206,220,0.18)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#55d6d2]/15 flex items-center justify-center">
          <Building2 size={16} className="text-[#55d6d2]" />
        </div>
        <div>
          <div className="text-xl font-bold text-[#e9f7f8]">杭州缤纷康养中心 · 智能床垫监测驾驶舱</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#91b4c1]">
          <Clock size={14} className="text-[#55d6d2]" />
          <span className="text-[#e9f7f8] font-medium">{timeStr}</span>
        </div>
        <div className="w-px h-4 bg-[rgba(117,206,220,0.2)] mx-1" />
        <button
          onClick={onRefresh}
          className={`p-1.5 rounded-lg text-[#91b4c1] hover:text-[#55d6d2] hover:bg-[#12334a] transition-colors ${refreshing ? 'animate-spin' : ''}`}
          title="刷新"
          type="button"
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg text-[#91b4c1] hover:text-[#55d6d2] hover:bg-[#12334a] transition-colors"
          title="全屏展示"
          type="button"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  )
}
