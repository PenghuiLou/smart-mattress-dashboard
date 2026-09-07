// src/components/cockpit/BedCard.jsx
/** 中央床位卡片：房间号、老人姓名、状态、离床未归时长 */
import React from 'react'
import { BedDouble, PersonStanding } from 'lucide-react'
import { BED_STATUS } from '../../data/mockData'

const STATUS_BORDER = {
  in_bed: 'border-[#63d19b]',
  out_of_bed: 'border-[#5ba7e8]',
  out_of_bed_timeout: 'border-[#ee716b]',
  pending_review: 'border-[#f2b35b]',
}

export default function BedCard({ bed, onClick }) {
  const st = BED_STATUS[bed.bedStatus] || { label: bed.bedStatus, color: '#55d6d2' }
  const border = STATUS_BORDER[bed.bedStatus] || 'border-[#55d6d2]'

  let StatusIcon = BedDouble
  if (bed.bedStatus === 'out_of_bed' || bed.bedStatus === 'out_of_bed_timeout') StatusIcon = PersonStanding

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-3 bg-[#12334a]/60 border cursor-pointer transition-all hover:bg-[#12334a]/90 ${border}`}
      title={`${bed.room}-${bed.bed} ${bed.elderName}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-xs text-[#91b4c1]">{bed.room}-{bed.bed}</div>
          <div className="text-sm font-medium text-[#e9f7f8] truncate">{bed.elderName}</div>
        </div>
        <div className="text-[#91b4c1] ml-2">{StatusIcon ? <StatusIcon size={16} /> : null}</div>
      </div>

      <div className="mt-2">
        <span
          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
          style={{ color: st.color, background: st.color + '20' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }}></span>
          {st.label}
        </span>
        {bed.bedStatus === 'out_of_bed_timeout' && (
          <div className="mt-1 text-xs text-[#ee716b]">离床 {bed.outOfBedMinutes || 40} 分钟</div>
        )}
      </div>
    </div>
  )
}