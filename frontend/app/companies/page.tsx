// frontend/app/companies/page.tsx
'use client'

import { useEffect, useState } from 'react'

type Company = {
  id: number
  name: string
  ticker: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch('http://localhost:8000/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })


        if (!res.ok) {
          throw new Error('企業一覧の取得に失敗しました')
        }

        const data = await res.json()
        setCompanies(data) // ← FastAPIが返す形式に合わせて
      } catch (err: any) {
        setError(err.message || 'エラーが発生しました')
      }
    }

    fetchCompanies()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>企業一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.name}（{company.ticker}）
          </li>
        ))}
      </ul>
    </div>
  )
}
