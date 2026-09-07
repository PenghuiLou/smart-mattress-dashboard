// src/components/cockpit/AlertDetailModal.jsx
/** 告警详情与处理弹窗：详情 + 操作记录 + 确认/转派/关闭/误报 */
import React from 'react'
import { X, AlertCircle } from 'lucide-react'
import { ALERT_TYPE_LABELS, ALERT_TYPE_COLORS, CAREGIVERS } from '../../data/mockData'

const LEVEL_LABEL = { normal: '提示', important: '警告', urgent: '紧急' }
const STATUS_LABEL = { pending: '待确认', processing: '处理中', transferred: '已转派', closed: '已关闭' }
const CLOSE_RESULTS = ['已现场确认', '老人已返回床位', '联系家属后确认', '设备误报', '传感器/设备故障', '其他']

export default function AlertDetailModal({ alert, open, onClose, onUpdate }) {
  if (!open || !alert) return null
  const color = ALERT_TYPE_COLORS[alert.type] || '#55d6d2'

  const handleConfirm = () => {
    onUpdate(alert.id, { status: 'processing', acknowledgedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) })
  }
  const handleTransfer = () => {
    const to = CAREGIVERS[Math.floor(Math.random() * CAREGIVERS.length)].name
    onUpdate(alert.id, { status: 'transferred', assignee: to })
  }
  const handleClose = () => {
    const result = window.prompt('请选择/填写处理结果（回车确认）：\n' + CLOSE_RESULTS.join('、'), CLOSE_RESULTS[0])
    if (result) {
      onUpdate(alert.id, { status: 'closed', closedAt: new Date().toISOString().replace('T', ' ').slice(0, 19), handler: alert.assignee, handlingResult: result })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="cockpit-panel rounded-2xl w-[640px] max-h-[88vh] overflow-y-auto cockpit-scrollbar m-4 text-[#e9f7f8]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(117,206,220,0.18)]">
          <div className="flex items-center gap-3">
            <AlertCircle style={{ color }} size={20} />
            <div className="text-lg font-medium">告警详情</div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#62818e] hover:text-[#e9f7f8] hover:bg-[#12334a]">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <Row label="告警类型" value={ALERT_TYPE_LABELS[alert.type] || alert.type} />
          <Row label="风险等级" value={LEVEL_LABEL[alert.level]} />
          <Row label="发生时间" value={alert.triggeredAt} />
          <Row label="持续时长" value={alert.duration || '—'} />
          <Row label="所在位置" value={`${alert.building}·${alert.floor} ${alert.room}室·${alert.bed}床`} />
          <Row label="老人" value={alert.elderName} />
          <Row label="责任人" value={alert.assignee || '—'} />
          <Row label="触发原因" value={alert.description} />
          <Row label="当前状态" value={STATUS_LABEL[alert.status]} />

          <div className="pt-2 border-t border-[rgba(117,206,220,0.12)]">
            <div className="text-xs text-[#91b4c1] mb-2">操作记录</div>
            <div className="space-y-2 text-xs text-[#91b4c1]">
              {(alert.operations || []).map((op, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#62818e]">{op.time}</span>
                  <span style={{ color }}>{op.type === 'trigger' ? '触发' : op.type === 'ack' ? '确认' : op.type === 'transfer' ? '转派' : '关闭'}</span>
                  <span>{op.by}</span>
                  {op.remark && <span className="text-[#62818e]">→ {op.remark}</span>}
                </div>
              ))}
            </div>
          </div>

          {alert.handlingResult && (
            <div className="pt-2">
              <div className="text-xs text-[#91b4c1]">处理结果：{alert.handlingResult}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-[rgba(117,206,220,0.18)]">
          {alert.status === 'closed' ? (
            <span className="text-xs text-[#62818e]">已关闭</span>
          ) : (
            <>
              <button onClick={handleConfirm} className="px-3 py-1.5 text-xs rounded-lg bg-[#5ba7e8]/15 text-[#5ba7e8] hover:bg-[#5ba7e8]/25" type="button">
                确认处理
              </button>
              <button onClick={handleTransfer} className="px-3 py-1.5 text-xs rounded-lg bg-[#9e8bea]/15 text-[#9e8bea] hover:bg-[#9e8bea]/25" type="button">
                转派
              </button>
              <button onClick={handleClose} className="px-3 py-1.5 text-xs rounded-lg bg-[#ee716b]/15 text-[#ee716b] hover:bg-[#ee716b]/25" type="button">
                标记误报/关闭
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex">
      <span className="text-[#62818e] w-28">{label}</span>
      <span className="text-[#e9f7f8] ml-4">{value}</span>
    </div>
  )
}
