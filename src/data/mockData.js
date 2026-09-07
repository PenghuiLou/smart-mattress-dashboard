/**
 * @file 智能床垫监测驾驶舱 - 统一 Mock 数据源
 *
 * 约定：
 * - 所有指标从本模块数据驱动，各组件通过 props 接收，避免在组件内重复硬编码。
 * - createDashboardData() 每次返回一份新数据（更新时间戳 + 趋势抖动），
 *   用于模拟 30 秒的自动刷新；床位布局与告警集合稳定，仅时间/趋势抖动。
 */

// ------------------------------------------------------------
// 工具：种子随机（确定性，便于刷新时观察到抖动）
// ------------------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return (((t ^ (t >>> 14)) >>> 0) % 10000) / 10000
  }
}

/** 告警相关规则 */
export const ALERT_RULES = {
  outOfBedMinutes: 30, // 离床未归观察时长（分钟）
  overdueMinutes: 10, // 告警待确认超时时长（分钟）
}

/** 护理人员名单（用于告警转派） */
export const CAREGIVERS = [
  { name: '李护工', group: '护理一组' },
  { name: '王护士', group: '护理一组' },
  { name: '陈护工', group: '护理二组' },
  { name: '赵护士', group: '护理二组' },
  { name: '孙护工', group: '护理三组' },
  { name: '周护士', group: '护理三组' },
]

// ------------------------------------------------------------
// 床位静态布局（29 张床位，覆盖 3 楼栋 × 3 楼层）
// name: 真实姓名，展示时脱敏； maskName 返回 "王**"
// ------------------------------------------------------------
const BED_LAYOUT = [
  // 1号楼 1F
  { building: '1号楼', floor: '1F', room: '101', bed: '01', name: '张明', caregiver: '李护工' },
  { building: '1号楼', floor: '1F', room: '101', bed: '02', name: '李红', caregiver: '李护工' },
  { building: '1号楼', floor: '1F', room: '102', bed: '01', name: '王刚', caregiver: '王护士' },
  { building: '1号楼', floor: '1F', room: '102', bed: '02', name: '赵丽', caregiver: '王护士' },
  { building: '1号楼', floor: '1F', room: '103', bed: '01', name: '陈秀', caregiver: '陈护工' },
  { building: '1号楼', floor: '1F', room: '103', bed: '02', name: '李强', caregiver: '陈护工' },
  { building: '1号楼', floor: '1F', room: '104', bed: '01', name: '刘芬', caregiver: '赵护士' },
  { building: '1号楼', floor: '1F', room: '104', bed: '02', name: '朱明', caregiver: '赵护士' },
  // 1号楼 2F
  { building: '1号楼', floor: '2F', room: '201', bed: '01', name: '孙花', caregiver: '孙护工' },
  { building: '1号楼', floor: '2F', room: '201', bed: '02', name: '周莲', caregiver: '孙护工' },
  { building: '1号楼', floor: '2F', room: '202', bed: '01', name: '吴敏', caregiver: '周护士' },
  { building: '1号楼', floor: '2F', room: '202', bed: '02', name: '徐霞', caregiver: '周护士' },
  // 1号楼 3F
  { building: '1号楼', floor: '3F', room: '301', bed: '01', name: '曹磊', caregiver: '李护工' },
  { building: '1号楼', floor: '3F', room: '301', bed: '02', name: '顾娟', caregiver: '李护工' },
  { building: '1号楼', floor: '3F', room: '302', bed: '01', name: '温明', caregiver: '王护士' },
  // 2号楼 1F
  { building: '2号楼', floor: '1F', room: '101', bed: '01', name: '藏文', caregiver: '陈护工' },
  { building: '2号楼', floor: '1F', room: '101', bed: '02', name: '林涛', caregiver: '陈护工' },
  { building: '2号楼', floor: '1F', room: '102', bed: '01', name: '何芳', caregiver: '赵护士' },
  // 2号楼 2F
  { building: '2号楼', floor: '2F', room: '201', bed: '01', name: '高伟', caregiver: '孙护工' },
  { building: '2号楼', floor: '2F', room: '201', bed: '02', name: '夏静', caregiver: '孙护工' },
  { building: '2号楼', floor: '2F', room: '202', bed: '01', name: '张艺', caregiver: '周护士' },
  { building: '2号楼', floor: '2F', room: '203', bed: '01', name: '李萍', caregiver: '李护工' },
  // 2号楼 3F
  { building: '2号楼', floor: '3F', room: '301', bed: '01', name: '王磊', caregiver: '王护士' },
  { building: '2号楼', floor: '3F', room: '302', bed: '01', name: '赵强', caregiver: '陈护工' },
  // 3号楼 1F
  { building: '3号楼', floor: '1F', room: '101', bed: '01', name: '孙慧', caregiver: '赵护士' },
  { building: '3号楼', floor: '1F', room: '101', bed: '02', name: '周勇', caregiver: '赵护士' },
  // 3号楼 2F
  { building: '3号楼', floor: '2F', room: '201', bed: '01', name: '吴琴', caregiver: '孙护工' },
  { building: '3号楼', floor: '2F', room: '202', bed: '01', name: '徐涛', caregiver: '周护士' },
  // 3号楼 3F
  { building: '3号楼', floor: '3F', room: '301', bed: '01', name: '曹敏', caregiver: '李护工' },
]

// 特殊状态索引（0-based），覆盖 PRD 要求的全部状态
const SPECIAL = {
  out_of_bed_timeout: [12, 19, 20], // 离床未归
  out_of_bed: [8, 9], // 离床中（未超时）
  device_offline: [15, 16], // 设备离线
  signal_low: [17], // 信号弱（在床）
  heart_risk: [{ idx: 13, hr: 118 }], // 心率异常提示
  resp_risk: [{ idx: 14, rr: 26 }], // 呼吸异常提示
  pending_review: [25], // 待人工确认
}

/**
 * 构建一份床位记录列表（设备 id 与 vitals 抖动）。
 * @param {() => number} rng
 */
function buildBeds(rng) {
  return BED_LAYOUT.map((l, i) => {
    const id = `B${String(i + 1).padStart(2, '0')}`
    const deviceId = `MT${String(i + 1).padStart(4, '0')}`
    const isHeartRisk = SPECIAL.heart_risk.some((s) => s.idx === i)
    const isRespRisk = SPECIAL.resp_risk.some((s) => s.idx === i)
    const isOffline = SPECIAL.device_offline.includes(i)
    const isTimeout = SPECIAL.out_of_bed_timeout.includes(i)
    const isOutOfBed = SPECIAL.out_of_bed.includes(i)
    const isSignalLow = SPECIAL.signal_low.includes(i)
    const isPending = SPECIAL.pending_review.includes(i) || isHeartRisk || isRespRisk

    let deviceStatus = 'online'
    let bedStatus = 'in_bed'
    let hr = undefined
    let rr = undefined
    let signalQuality = 'good'

    if (isOffline) {
      deviceStatus = 'offline'
      bedStatus = 'pending_review'
      signalQuality = 'none'
    } else if (isSignalLow) {
      deviceStatus = 'signal_low'
      bedStatus = 'in_bed'
      signalQuality = 'poor'
    }

    if (isTimeout) {
      bedStatus = 'out_of_bed_timeout'
    } else if (isOutOfBed) {
      bedStatus = 'out_of_bed'
    }

    // vitals：仅在线设备才有有效数值
    if (deviceStatus === 'online') {
      hr = isHeartRisk ? SPECIAL.heart_risk.find((s) => s.idx === i).hr : Math.round(62 + rng() * 28)
      rr = isRespRisk ? SPECIAL.resp_risk.find((s) => s.idx === i).rr : Math.round(12 + rng() * 6)
    }

    const riskLevel = isHeartRisk || isRespRisk || isTimeout || isPending ? 'attention' : 'normal'

    // 离床时长（分钟）：未归 31~45 分钟，未超时离床 5~25 分钟
    const outOfBedMinutes = isTimeout ? 31 + Math.round(rng() * 14) : isOutOfBed ? 5 + Math.round(rng() * 20) : 0

    return {
      id,
      building: l.building,
      floor: l.floor,
      room: l.room,
      bed: l.bed,
      elderName: l.name,
      deviceId,
      deviceStatus,
      bedStatus,
      heartRate: hr,
      respirationRate: rr,
      signalQuality,
      caregiver: l.caregiver,
      lastUpdate: formatLastUpdate(Math.round(rng() * 90)),
      riskLevel,
      heartAbnormal: isHeartRisk,
      respAbnormal: isRespRisk,
      outOfBedMinutes,
    }
  })
}

// 告警模板（18 条今日告警）。状态：pending 3 / processing 1 / transferred 1 / closed 13
// room/bed 全部对应真实床位。building/floor 显式填写。
const ALERT_TEMPLATES = [
  { type: 'out_of_bed', level: 'urgent', building: '1号楼', floor: '3F', room: '301', bed: '01', name: '曹磊', desc: '离床已超过 42 分钟，尚未回床', assignee: '李护工', op: 'pending', minutesAgo: 42 },
  { type: 'out_of_bed', level: 'urgent', building: '2号楼', floor: '2F', room: '201', bed: '02', name: '夏静', desc: '离床已超过 38 分钟，尚未回床', assignee: '孙护工', op: 'pending', minutesAgo: 38 },
  { type: 'out_of_bed', level: 'important', building: '2号楼', floor: '2F', room: '202', bed: '01', name: '张艺', desc: '离床已超过 35 分钟，尚未回床', assignee: '周护士', op: 'pending', minutesAgo: 35 },
  { type: 'heart_rate', level: 'important', building: '1号楼', floor: '3F', room: '301', bed: '02', name: '顾娟', desc: '心率异常告警，请人工确认', assignee: '李护工', op: 'processing', ackMin: 6, minutesAgo: 28 },
  { type: 'respiration', level: 'important', building: '1号楼', floor: '3F', room: '302', bed: '01', name: '温明', desc: '呼吸异常告警，请关注', assignee: '王护士', op: 'transferred', transferTo: '周护士', minutesAgo: 25 },
  { type: 'out_of_bed', level: 'important', building: '1号楼', floor: '2F', room: '201', bed: '01', name: '孙花', desc: '离床已超过 33 分钟，尚未回床', assignee: '孙护工', op: 'closed', result: '护工陪同归床', ackMin: 5, minutesAgo: 33, closeMin: 15 },
  { type: 'heart_rate', level: 'important', building: '1号楼', floor: '3F', room: '301', bed: '02', name: '顾娟', desc: '心率异常告警，请人工确认', assignee: '李护工', op: 'closed', result: '联系家属后确认，休息后恢复', ackMin: 2, minutesAgo: 20, closeMin: 6 },
  { type: 'device_offline', level: 'important', building: '2号楼', floor: '1F', room: '101', bed: '01', name: '藏文', desc: '设备离线，采集异常', assignee: '运维张', op: 'closed', result: '设备重启后恢复在线', ackMin: 5, minutesAgo: 45, closeMin: 20 },
  { type: 'respiration', level: 'important', building: '1号楼', floor: '3F', room: '302', bed: '01', name: '温明', desc: '呼吸异常告警，请关注', assignee: '陈护工', op: 'closed', result: '现场核查后观察正常', ackMin: 3, minutesAgo: 22, closeMin: 9 },
  { type: 'out_of_bed', level: 'important', building: '2号楼', floor: '2F', room: '202', bed: '01', name: '张艺', desc: '离床已超过 32 分钟，尚未回床', assignee: '周护士', op: 'closed', result: '已现场确认，老人已回床', ackMin: 4, minutesAgo: 30, closeMin: 10 },
  { type: 'heart_rate', level: 'important', building: '1号楼', floor: '3F', room: '301', bed: '02', name: '顾娟', desc: '心率异常告警，请人工确认', assignee: '王护士', op: 'closed', result: '设备误报，信号干扰', ackMin: 3, minutesAgo: 18, closeMin: 7 },
  { type: 'device_offline', level: 'important', building: '2号楼', floor: '1F', room: '101', bed: '02', name: '林涛', desc: '设备离线，采集异常', assignee: '运维李', op: 'closed', result: '检查后天线接触不良，重新安装', ackMin: 7, minutesAgo: 50, closeMin: 22 },
  { type: 'out_of_bed', level: 'important', building: '1号楼', floor: '3F', room: '301', bed: '01', name: '曹磊', desc: '离床已超过 31 分钟，尚未回床', assignee: '李护工', op: 'closed', result: '已回床，观察中', ackMin: 5, minutesAgo: 31, closeMin: 14 },
  { type: 'respiration', level: 'important', building: '1号楼', floor: '3F', room: '302', bed: '01', name: '温明', desc: '呼吸异常告警，请关注', assignee: '陈护工', op: 'closed', result: '观察后正常', ackMin: 2, minutesAgo: 19, closeMin: 8 },
  { type: 'signal_low', level: 'normal', building: '2号楼', floor: '2F', room: '201', bed: '01', name: '高伟', desc: '信号质量不足，建议检查天线', assignee: '运维王', op: 'closed', result: '信号恢复正常', ackMin: 3, minutesAgo: 38, closeMin: 12 },
  { type: 'out_of_bed', level: 'important', building: '1号楼', floor: '2F', room: '201', bed: '01', name: '孙花', desc: '夜间离床活动，已回床', assignee: '孙护工', op: 'closed', result: '已回床', ackMin: 3, minutesAgo: 120, closeMin: 30 },
  { type: 'heart_rate', level: 'normal', building: '1号楼', floor: '3F', room: '301', bed: '02', name: '顾娟', desc: '心率异常告警，请人工确认', assignee: '李护工', op: 'closed', result: '休息后恢复正常', ackMin: 4, minutesAgo: 95, closeMin: 18 },
  { type: 'out_of_bed', level: 'important', building: '2号楼', floor: '2F', room: '202', bed: '01', name: '张艺', desc: '离床已超过 34 分钟，尚未回床', assignee: '周护士', op: 'closed', result: '已回床', ackMin: 4, minutesAgo: 34, closeMin: 11 },
]

function formatTime(minutesAgo) {
  const d = new Date(Date.now() - minutesAgo * 60000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatLastUpdate(minutesAgo) {
  if (minutesAgo <= 0) return '刚刚'
  if (minutesAgo < 60) return `${minutesAgo}分钟前`
  const h = Math.floor(minutesAgo / 60)
  const m = minutesAgo % 60
  if (minutesAgo < 1440) return m ? `${h}小时${m}分钟前` : `${h}小时前`
  return `${h}小时前`
}

/** 构建今日告警（触发/确认/关闭时间抖动） */
function buildAlerts(rng) {
  return ALERT_TEMPLATES.map((t, i) => {
    const id = `A${String(i + 1).padStart(3, '0')}`
    const triggeredAt = formatTime(t.minutesAgo)
    const ops = [{ time: triggeredAt, type: 'trigger', by: '系统' }]
    let status = t.op
    let assignee = t.assignee
    let acknowledgedAt, closedAt, handler, handlingResult

    if (t.op === 'pending') {
      // 可能已超时
    } else if (t.op === 'processing') {
      acknowledgedAt = formatTime(t.minutesAgo - (t.ackMin || 1))
      ops.push({ time: acknowledgedAt, type: 'ack', by: assignee })
    } else if (t.op === 'transferred') {
      assignee = t.transferTo
      ops.push({ time: formatTime(t.minutesAgo - 5), type: 'transfer', by: t.assignee, remark: t.transferTo })
    } else if (t.op === 'closed') {
      acknowledgedAt = formatTime(t.minutesAgo - (t.ackMin || 1))
      closedAt = formatTime(t.minutesAgo - (t.closeMin || 0))
      handler = t.assignee
      handlingResult = t.result
      ops.push({ time: acknowledgedAt, type: 'ack', by: t.assignee })
      if (t.closeMin) ops.push({ time: closedAt, type: 'close', by: t.assignee, remark: t.result })
    }

    return {
      id,
      type: t.type,
      status,
      level: t.level,
      elderName: t.name,
      building: t.building,
      floor: t.floor,
      room: t.room,
      bed: t.bed,
      description: t.desc,
      triggeredAt,
      duration: t.minutesAgo < 60 ? `${t.minutesAgo}分钟` : `${Math.round(t.minutesAgo / 60)}小时${t.minutesAgo % 60}分钟`,
      assignee,
      acknowledgedAt,
      closedAt,
      handler,
      handlingResult,
      operations: ops,
    }
  })
}

/** 构建 24 小时每小时告警趋势（按类型） */
function buildTrend24h(rng) {
  const types = ['out_of_bed', 'heart_rate', 'respiration', 'device']
  const data = []
  for (let h = 0; h < 24; h++) {
    const item = { hour: `${String(h).padStart(2, '0')}:00` }
    let total = 0
    types.forEach((tp) => {
      const v = tp === 'device' ? Math.round(rng() * 2) : Math.round(rng() * 3)
      item[tp] = v
      total += v
    })
    item.total = total
    data.push(item)
  }
  return data
}

/** 构建近 7 日告警趋势（按类型） */
function buildTrend7d(rng) {
  const types = ['out_of_bed', 'heart_rate', 'respiration', 'device']
  const data = []
  for (let d = 6; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000)
    const item = { date: `${date.getMonth() + 1}-${date.getDate()}日` }
    let total = 0
    types.forEach((tp) => {
      const v = tp === 'device' ? Math.round(rng() * 2) : Math.round(rng() * 4)
      item[tp] = v
      total += v
    })
    item.total = total
    data.push(item)
  }
  return data
}

/** 设备在线率 24 小时趋势 */
function buildDeviceTrend24h(rng) {
  const data = []
  for (let h = 0; h < 24; h++) {
    const v = 93 + rng() * 5
    data.push({ hour: `${String(h).padStart(2, '0')}:00`, rate: Number(v.toFixed(1)) })
  }
  return data
}

/** 统一入口：生成一份驾驶舱聚合数据（时间戳/趋势抖动） */
export function createDashboardData() {
  const rng = mulberry32(Date.now())
  const beds = buildBeds(rng)
  const alerts = buildAlerts(rng)
  return {
    beds,
    alerts,
    lastUpdate: formatTime(0),
    now: formatTime(0),
    trend24h: buildTrend24h(rng),
    trend7d: buildTrend7d(rng),
    deviceTrend24h: buildDeviceTrend24h(rng),
  }
}

/** 固定种子数据（代表“昨日”基线，用于计算较昨日变化） */
export function createDashboardDataFixed() {
  const rng = mulberry32(1234567)
  const beds = buildBeds(rng)
  const alerts = buildAlerts(rng)
  return {
    beds,
    alerts,
    lastUpdate: formatTime(0),
    now: formatTime(0),
    trend24h: buildTrend24h(rng),
    trend7d: buildTrend7d(rng),
    deviceTrend24h: buildDeviceTrend24h(rng),
  }
}

/** 告警类型文案（避免医学判定表述） */
export const ALERT_TYPE_LABELS = {
  out_of_bed: '离床未归',
  heart_rate: '心率',
  respiration: '呼吸',
  device_offline: '设备离线',
  signal_low: '信号质量',
}

/** 告警类型颜色（用于图表/图标） */
export const ALERT_TYPE_COLORS = {
  out_of_bed: '#f2b35b', // amber
  heart_rate: '#ee716b', // red
  respiration: '#9e8bea', // purple
  device_offline: '#5b8c9f', // 灰蓝
  signal_low: '#5b8c9f',
}

/** 床位状态文案与颜色 */
export const BED_STATUS = {
  in_bed: { label: '在床·体征正常', color: '#63d19b' },
  out_of_bed: { label: '离床中', color: '#5ba7e8' },
  out_of_bed_timeout: { label: '离床未归', color: '#ee716b' },
  pending_review: { label: '待确认', color: '#f2b35b' },
}

/** 遮罩显示老人姓名 */
export function maskName(name) {
  if (!name) return ''
  return name.charAt(0) + '**'
}

/**
 * 从聚合数据计算全部指标（统一口径）
 */
export function computeMetrics(data) {
  const { beds, alerts } = data
  const bedTotal = beds.length
  const deviceTotal = beds.length
  const deviceOnline = beds.filter((b) => b.deviceStatus !== 'offline').length
  const deviceOnlineRate = (deviceOnline / deviceTotal) * 100

  const inBed = beds.filter((b) => b.bedStatus === 'in_bed').length
  const outOfBed = beds.filter((b) => b.bedStatus === 'out_of_bed').length
  const outOfBedUnreturned = beds.filter((b) => b.bedStatus === 'out_of_bed_timeout').length

  const riskElders = beds.filter(
    (b) => b.riskLevel === 'attention' || b.bedStatus === 'pending_review' || b.heartAbnormal || b.respAbnormal
  ).length

  const todayAlerts = alerts // mock 中全部为今日
  const pendingAlerts = alerts.filter((a) => ['pending', 'processing', 'transferred'].includes(a.status))
  const closedAlerts = alerts.filter((a) => a.status === 'closed')
  const closureRate = (closedAlerts.length / todayAlerts.length) * 100

  const ackDurations = todayAlerts
    .filter((a) => a.acknowledgedAt && a.triggeredAt)
    .map((a) => Math.abs(Date.parse(a.acknowledgedAt) - Date.parse(a.triggeredAt)) / 60000)
  const avgResponseMinutes = ackDurations.length ? ackDurations.reduce((a, b) => a + b, 0) / ackDurations.length : 0

  const overdueAlerts = pendingAlerts.filter((a) => (Date.now() - Date.parse(a.triggeredAt)) / 60000 > ALERT_RULES.overdueMinutes).length

  const monitoringNormal = beds.filter((b) => b.riskLevel === 'normal' && b.deviceStatus !== 'offline').length
  const attentionElders = beds.filter((b) => b.riskLevel === 'attention').length
  const pendingReview = beds.filter((b) => b.bedStatus === 'pending_review').length

  const heartOk = beds.filter((b) => b.heartRate && !b.heartAbnormal).length
  const respOk = beds.filter((b) => b.respirationRate && !b.respAbnormal).length
  const heartRisk = beds.filter((b) => b.heartAbnormal).length
  const respRisk = beds.filter((b) => b.respAbnormal).length

  return {
    bedTotal,
    deviceTotal,
    deviceOnline,
    deviceOnlineRate,
    inBed,
    outOfBed,
    outOfBedUnreturned,
    pendingAlerts: pendingAlerts.length,
    todayAlerts: todayAlerts.length,
    closedAlerts: closedAlerts.length,
    closureRate,
    avgResponseMinutes,
    avgResponseText: formatDuration(avgResponseMinutes),
    riskElders,
    overdueAlerts,
    transferredAlerts: alerts.filter((a) => a.operations?.some((o) => o.type === 'transfer')).length,
    monitoringNormal,
    attentionElders,
    pendingReview,
    heartOk,
    respOk,
    heartRisk,
    respRisk,
  }
}

/** 格式化分钟 => 可读时长 */
export function formatDuration(minutes) {
  if (!minutes || !isFinite(minutes)) return '0秒'
  const m = Math.round(minutes)
  if (m < 1) return '小于1分钟'
  const h = Math.floor(m / 60)
  const mm = m % 60
  if (h === 0) return `${mm}秒`
  return `${h}分${mm}秒`
}

export default {
  createDashboardData,
  computeMetrics,
  ALERT_RULES,
  CAREGIVERS,
  ALERT_TYPE_LABELS,
  ALERT_TYPE_COLORS,
  BED_STATUS,
  maskName,
}
