// src/cockpit-main.jsx
/**
 * 独立大屏入口：直接渲染智能床垫监测驾驶舱，不经过管理后台的侧边栏/Header。
 * 访问地址：/cockpit.html
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import Cockpit from './pages/Cockpit.jsx'
import './index.css'
import './dashboard.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Cockpit />
  </React.StrictMode>,
)