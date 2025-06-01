// frontend/app/ir-reports/page.tsx
'use client'

import { useEffect, useState } from 'react'

type IRReport = {
  id: number
  company_id: number
  title: string
  summary: string
}

export default function IRReportsPage() {
  const [reports, setReports] = useState<IRReport[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch('http://localhost:8000/ir-reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('IR資料の取得に失敗しました')
        }

        const data = await res.json()
        setReports(data)
      } catch (err: any) {
        setError(err.message || 'エラーが発生しました')
      }
    }

    fetchReports()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>IR資料一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            <strong>{report.title}</strong>
            <p>企業ID: {report.company_id}</p>
            <p>{report.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
