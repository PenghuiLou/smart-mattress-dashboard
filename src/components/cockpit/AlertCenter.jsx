// src/components/cockpit/AlertCenter.jsx
/** 右列 - 实时告警中心：待处理告警列表 + 筛选 + 快速操作 */
import React from 'react'
import { AlertCircle, Clock, ChevronRight, Check, Share2, X } from 'lucide-react'
import { ALERT_TYPE_LABELS, ALERT_TYPE_COLORS, CAREGIVERS } from '../../data/mockData'

const LEVEL_LABEL = { normal: '提示', important: '警告', urgent: '紧急' }
const STATUS_LABEL = { pending: '待确认', processing: '处理中', transferred: '已转派', closed: '已关闭' }
const SORT_T = { urgent: 0, important: 1, normal: 2 }
const TYPES = ['all', 'out_of_bed', 'heart_rate', 'respiration']

export default function AlertCenter({ alerts = [], onSelect, onUpdate }) {
  const [typeFilter, setTypeFilter] = React.useState('all')

  const unclosed = alerts.filter((a) => ['pending', 'processing', 'transferred'].includes(a.status))

  const filtered = unclosed
    .filter((a) => typeFilter === 'all' || a.type === typeFilter)
    .sort((a, b) => {
      if (SORT_T[a.level] !== SORT_T[b.level]) return SORT_T[a.level] - SORT_T[b.level]
      return Date.parse(b.triggeredAt) - Date.parse(a.triggeredAt)
    })

  const confirm = (a) => onUpdate(a.id, { status: 'processing', acknowledgedAt: new Date().toISOString().replace('T', ' ').slice(0, 19), assignee: a.assignee })
  const transfer = (a) => {
    const to = CAREGIVERS[Math.floor(Math.random() * CAREGIVERS.length)].name
    onUpdate(a.id, { status: 'transferred', assignee: to, operations: [...(a.operations || []), { time: new Date().toISOString().replace('T', ' ').slice(0, 19), type: 'transfer', by: a.assignee, remark: to }] })
  }
  const close = (a) => onUpdate(a.id, { status: 'closed', closedAt: new Date().toISOString().replace('T', ' ').slice(0, 19), handler: a.assignee, handlingResult: '已现场确认，处理结束' })

  return (
    <div className="cockpit-panel rounded-2xl p-4 flex flex-col h-[560px]">
      <div className="text-sm font-medium text-[#e9f7f8] mb-3">实时告警中心</div>

      <div className="flex gap-1 mb-3 flex-wrap">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              typeFilter === t ? 'bg-[#55d6d2] text-[#04121f] font-medium' : 'text-[#91b4c1] hover:text-[#e9f7f8] bg-[#04121f]'
            }`}
          >
            {t === 'all' ? '全部' : ALERT_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto cockpit-scrollbar pr-1">
        {filtered.length === 0 ? (
          <div className="text-center text-[#62818e] py-8">暂无待处理告警</div>
        ) : (
          <div className="space-y-2">
            {filtered.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="relative rounded-xl p-3 bg-[#04121f]/60 border border-[rgba(117,206,220,0.1)] hover:border-[#55d6d2]/40 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: a.level === 'urgent' ? '#ee716b' : a.level === 'important' ? '#f2b35b' : '#5ba7e8' }}
                    />
                    <span className="text-xs text-[#91b4c1]">{ALERT_TYPE_LABELS[a.type] || a.type}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ color: a.level === 'urgent' ? '#ee716b' : a.level === 'important' ? '#f2b35b' : '#5ba7e8', background: 'rgba(255,255,255,0.04)' }}
                    >
                      {LEVEL_LABEL[a.level]}
                    </span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#63d19b]/15 text-[#63d19b]">{STATUS_LABEL[a.status]}</span>
                </div>
                <div className="mt-1 text-sm text-[#e9f7f8] font-medium">{a.description}</div>
                <div className="mt-1 text-xs text-[#91b4c1] flex items-center gap-2">
                  <span>{a.building}·{a.floor} {a.room}室·{a.bed}床</span>
                  <span>·</span>
                  <span>{a.elderName}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-[#62818e]">
                  <span>触发：{a.triggeredAt}</span>
                  <span>责任人：{a.assignee || '—'}</span>
                </div>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); confirm(a) }}
                    className="px-3 py-1 text-xs rounded-lg bg-[#5ba7e8]/15 text-[#5ba7e8] hover:bg-[#5ba7e8]/25 transition-colors"
                    type="button"
                  >
                    处置
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect && onSelect(a) }}
                    className="px-3 py-1 text-xs rounded-lg bg-[#55d6d2]/15 text-[#55d6d2] hover:bg-[#55d6d2]/25 transition-colors"
                    type="button"
                  >
                    详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-[10px] text-[#62818e] mt-2">* 告警处理仅作用于演示数据，实时同步统计</div>
    </div>
  )
}
