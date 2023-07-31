import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {

  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_SERVER_NAME && process.env.VITE_SERVER_PORT
              ? `http://${process.env.VITE_SERVER_NAME}:${process.env.VITE_SERVER_PORT}`
              : 'http://localhost:5000',
          changeOrigin: true,
          secure: false,      
          ws: true,
        }
      },
      host: true, // Here
      port: process.env.VITE_PORT || 8080,
    },
  })
}
