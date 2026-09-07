/**
 * @file 智能床垫监测驾驶舱 - 类型定义（JSDoc）
 * 说明：当前项目为 JavaScript（无 TypeScript），此处用 JSDoc 给出类型约定，
 *      供 IDE 提示与代码自查。运行时不参与校验。
 */

/**
 * 设备在线状态
 * @typedef {'online' | 'offline' | 'signal_low'} DeviceStatus
 */

/**
 * 床位/老人当前状态
 * @typedef {'in_bed' | 'out_of_bed' | 'out_of_bed_timeout' | 'pending_review'} BedStatus
 */

/**
 * 告警类型
 * @typedef {'out_of_bed' | 'heart_rate' | 'respiration' | 'device_offline' | 'signal_low'} AlertType
 */

/**
 * 告警处理状态
 * @typedef {'pending' | 'processing' | 'transferred' | 'closed'} AlertStatus
 */

/**
 * 风险等级
 * @typedef {'normal' | 'attention' | 'high'} RiskLevel
 */

/**
 * 信号质量
 * @typedef {'good' | 'fair' | 'poor' | 'none'} SignalQuality
 */

/**
 * 床位记录
 * @typedef {Object} BedRecord
 * @property {string} id
 * @property {string} building
 * @property {string} floor
 * @property {string} room
 * @property {string} bed
 * @property {string} elderName
 * @property {string} deviceId
 * @property {DeviceStatus} deviceStatus
 * @property {BedStatus} bedStatus
 * @property {number} [heartRate]
 * @property {number} [respirationRate]
 * @property {SignalQuality} signalQuality
 * @property {string} caregiver
 * @property {string} lastUpdate
 * @property {RiskLevel} riskLevel
 * @property {boolean} [heartAbnormal]
 * @property {boolean} [respAbnormal]
 */

/**
 * 告警记录
 * @typedef {Object} AlertRecord
 * @property {string} id
 * @property {AlertType} type
 * @property {AlertStatus} status
 * @property {'normal' | 'important' | 'urgent'} level
 * @property {string} elderName
 * @property {string} building
 * @property {string} floor
 * @property {string} room
 * @property {string} bed
 * @property {string} description
 * @property {string} triggeredAt
 * @property {string} [duration]
 * @property {string} [assignee]
 * @property {string} [acknowledgedAt]
 * @property {string} [closedAt]
 * @property {string} [handler]
 * @property {string} [handlingResult]
 * @property {Array<{time:string; type:string; by:string; remark?:string}>} [operations]
 */

/**
 * 驾驶舱聚合数据
 * @typedef {Object} DashboardData
 * @property {BedRecord[]} beds
 * @property {AlertRecord[]} alerts
 * @property {string} lastUpdate
 * @property {string} now
 * @property {Array<Object>} trend24h
 * @property {Array<Object>} trend7d
 * @property {Array<Object>} deviceTrend24h
 */

/**
 * 护理人员列表
 * @typedef {Object} Caregiver
 * @property {string} name
 * @property {string} [group]
 */

export {}
