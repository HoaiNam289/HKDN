import { useEffect, useState } from 'react'
import api from './services/api'

function App() {
  const [status, setStatus] = useState('Đang kiểm tra...')

  useEffect(() => {
    api.get('/health')
      .then((response) => {
        setStatus(response.data.status)
      })
      .catch(() => {
        setStatus('Không kết nối được Backend')
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="rounded-xl bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600">
          HKDN - Certificate Verification System
        </h1>

        <p className="mt-4">
          Backend Status: <strong>{status}</strong>
        </p>
      </div>
    </div>
  )
}

export default App
