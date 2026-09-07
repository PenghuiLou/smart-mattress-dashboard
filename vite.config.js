import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 若部署到 GitHub Pages 项目子路径，base 需与仓库名一致：
// https://<user>.github.io/smart-mattress-dashboard/
export default defineConfig({
  plugins: [react()],
  base: '/smart-mattress-dashboard/',
})
