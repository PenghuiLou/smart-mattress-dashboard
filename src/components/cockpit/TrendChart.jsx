// src/components/cockpit/TrendChart.jsx
/** 统一趋势图封装：line / line-multi / bar / pie，深色背景下清晅可读 */
import React from 'react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis } from 'recharts'

export default function TrendChart({ variant = 'line', data = [], xKey, series = [], height = 160, withArea = false, hideYAxis = false, hideXAxis = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#62818e] text-xs" style={{ height }}>
        暂无数据
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      {variant === 'line' && (
        <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(185,211,221,0.08)" />
          {!hideXAxis && <XAxis dataKey={xKey} tick={{ fill: '#91b4c1', fontSize: 10 }} axisLine={{ stroke: 'rgba(185,211,221,0.15)' }} tickLine={{ stroke: 'rgba(185,211,221,0.15)' }} />}
          {!hideYAxis && <YAxis tick={{ fill: '#91b4c1', fontSize: 10 }} axisLine={{ stroke: 'rgba(185,211,221,0.15)' }} tickLine={{ stroke: 'rgba(185,211,221,0.15)' }} />}
          <Tooltip contentStyle={{ backgroundColor: '#04121f', borderColor: 'rgba(117,206,220,0.3)', color: '#e9f7f8', fontSize: 11 }} />
          <Line type="monotone" dataKey={series[0]?.key || 'value'} stroke={series[0]?.color || '#55d6d2'} strokeWidth={2.5} dot={{ fill: '#55d6d2', r: 3 }} isAnimationActive strokeLinecap="round" />
        </LineChart>
      )}
      {variant === 'line-multi' && (
        <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(185,211,221,0.08)" />
          <XAxis dataKey={xKey} tick={{ fill: '#91b4c1', fontSize: 10 }} axisLine={{ stroke: 'rgba(185,211,221,0.15)' }} tickLine={{ stroke: 'rgba(185,211,221,0.15)' }} />
          <YAxis tick={{ fill: '#91b4c1', fontSize: 10 }} axisLine={{ stroke: 'rgba(185,211,221,0.15)' }} tickLine={{ stroke: 'rgba(185,211,221,0.15)' }} />
          <Tooltip contentStyle={{ backgroundColor: '#04121f', borderColor: 'rgba(117,206,220,0.3)', color: '#e9f7f8', fontSize: 11 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 10, color: '#91b4c1', paddingTop: 4 }} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={{ fill: s.color, r: 2.5 }} isAnimationActive name={s.name} />
          ))}
        </LineChart>
      )}
      {variant === 'bar' && (
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(185,211,221,0.08)" />
          <XAxis type="number" tick={{ fill: '#91b4c1', fontSize: 10 }} axisLine={{ stroke: 'rgba(185,211,221,0.15)' }} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#91b4c1', fontSize: 10 }} width={56} />
          <Tooltip contentStyle={{ backgroundColor: '#04121f', borderColor: 'rgba(117,206,220,0.3)', color: '#e9f7f8', fontSize: 11 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 10, color: '#91b4c1', paddingTop: 4 }} />
          {series.map((s) => (
            <Bar key={s.key} dataKey="value" fill={s.color} radius={[0, 6, 6, 0]} isAnimationActive name={s.name} />
          ))}
        </BarChart>
      )}
      {variant === 'pie' && (
        <PieChart data={data}>
          <Tooltip contentStyle={{ backgroundColor: '#04121f', borderColor: 'rgba(117,206,220,0.3)', color: '#e9f7f8', fontSize: 11 }} />
          <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value" nameKey="name" isAnimationActive stroke="none">
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={series[i]?.color || '#55d6d2'} />
            ))}
          </Pie>
        </PieChart>
      )}
    </ResponsiveContainer>
  )
}
