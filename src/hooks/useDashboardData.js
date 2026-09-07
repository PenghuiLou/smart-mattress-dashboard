// src/hooks/useDashboardData.js
/**
 * @file 智能床垫驾驶舱 - 数据与刷新钩子
 */
import { useState, useEffect, useCallback } from 'react'
import { createDashboardData, createDashboardDataFixed, computeMetrics, ALERT_RULES } from '../data/mockData'

const REFRESH_INTERVAL = 30000

const DELTA_FIELDS = ['inBed', 'outOfBed', 'outOfBedUnreturned', 'pendingAlerts', 'todayAlerts', 'deviceOnlineRate', 'closureRate', 'avgResponseMinutes', 'riskElders']

export function useDashboardData() {
  const [data, setData] = useState(() => createDashboardData())
  const [refreshing, setRefreshing] = useState(false)
  const [baseline] = useState(() => computeMetrics(createDashboardDataFixed()))

  const current = computeMetrics(data)

  const changes = {}
  DELTA_FIELDS.forEach((k) => {
    const cur = current[k]
    const base = baseline[k]
    if (typeof cur === 'number' && typeof base === 'number') {
      changes[k] = cur - base
    }
  })

  const refresh = useCallback(() => {
    setRefreshing(true)
    const next = createDashboardData()
    setData(next)
    setTimeout(() => setRefreshing(false), 400)
  }, [])

  useEffect(() => {
    const id = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [refresh])

  const updateAlert = useCallback((alertId, patch) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19)
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => {
        if (a.id !== alertId) return a
        const ops = a.operations ? [...a.operations] : []
        if (patch.status === 'processing' && !a.acknowledgedAt) {
          ops.push({ time: nowStr, type: 'ack', by: patch.handler || '操作人' })
        }
        if (patch.status === 'transferred') {
          ops.push({ time: nowStr, type: 'transfer', by: a.assignee || '操作人', remark: patch.assignee })
        }
        if (patch.status === 'closed' && patch.closedAt) {
          ops.push({ time: patch.closedAt, type: 'close', by: patch.handler || '操作人', remark: patch.handlingResult })
        }
        return { ...a, ...patch, operations: ops }
      }),
    }))
  }, [])

  return {
    data,
    metrics: current,
    baseline,
    changes,
    refreshing,
    refresh,
    updateAlert,
    rules: ALERT_RULES,
  }
}
