'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>📊 IR投資AI デモアプリ</h1>
      <p style={{ marginTop: '1rem' }}>
        このアプリでは、企業のIR資料をAIで要約＆分析し、ポートフォリオを管理できます。
      </p>

      <h2 style={{ marginTop: '2rem' }}>📂 機能一覧</h2>
      <ul style={{ lineHeight: '2rem' }}>
        <li>🔍 <Link href="/companies">企業一覧</Link></li>
        <li>📄 <Link href="/ir-reports">IR資料一覧</Link></li>
        <li>🤖 <Link href="/analyze">AI分析</Link></li>
        <li>💼 <Link href="/portfolio">ポートフォリオ管理</Link></li>
      </ul>
    </div>
  )
}
