// src/components/cockpit/BedMap.jsx
/** 中央 - 楼层/房间/床位状态总览，含楼栋/楼层筛选 */
import React from 'react'
import { Filter } from 'lucide-react'
import BedCard from './BedCard'

export default function BedMap({ beds = [], onBedClick }) {
  const [building, setBuilding] = React.useState('全部区域')
  const [floor, setFloor] = React.useState('全部楼层')

  const buildings = ['全部区域', ...new Set(beds.map((b) => b.building))]
  const floors = ['全部楼层', ...new Set(beds.filter((b) => (building === '全部区域' ? true : b.building === building)).map((b) => b.floor))]

  const filtered = beds.filter((b) => {
    const bOk = building === '全部区域' || b.building === building
    const fOk = floor === '全部楼层' || b.floor === floor
    return bOk && fOk
  })

  const rooms = React.useMemo(() => {
    const map = {}
    filtered.forEach((b) => {
      const key = `${b.building}-${b.floor}-${b.room}`
      if (!map[key]) map[key] = []
      map[key].push(b)
    })
    return map
  }, [filtered])

  const roomKeys = Object.keys(rooms)

  return (
    <div className="cockpit-panel rounded-2xl p-4 h-full flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Filter size={14} className="text-[#91b4c1]" />
        <div className="flex gap-1 flex-wrap">
          {buildings.map((b) => (
            <button
              key={b}
              onClick={() => { setBuilding(b); setFloor('全部楼层') }}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                building === b ? 'bg-[#55d6d2] text-[#04121f] font-medium' : 'bg-[#04121f] text-[#91b4c1] hover:text-[#e9f7f8]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-[rgba(117,206,220,0.2)] mx-1" />
        <div className="flex gap-1 flex-wrap">
          {floors.map((f) => (
            <button
              key={f}
              onClick={() => setFloor(f)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                floor === f ? 'bg-[#5ba7e8] text-[#04121f] font-medium' : 'bg-[#04121f] text-[#91b4c1] hover:text-[#e9f7f8]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto cockpit-scrollbar">
        {roomKeys.length === 0 ? (
          <div className="text-center text-[#62818e] py-10">暂无床位</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomKeys.map((key) => {
              const [bld, flr, rm] = key.split('-')
              const roomBeds = rooms[key]
              const anyRisk = roomBeds.some((b) => b.riskLevel === 'attention' || b.bedStatus !== 'in_bed')
              return (
                <div
                  key={key}
                  className={`rounded-xl p-3 ${anyRisk ? 'bg-[#12334a]/80 border border-[#ee716b]/40' : 'bg-[#12334a]/40 border border-[rgba(117,206,220,0.12)]'}`}
                >
                  <div className="text-xs text-[#91b4c1] mb-2">{bld} {flr} {rm}室</div>
                  <div className="grid grid-cols-2 gap-2">
                    {roomBeds.map((bed) => (
                      <BedCard key={bed.id} bed={bed} onClick={() => onBedClick && onBedClick(bed)} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
