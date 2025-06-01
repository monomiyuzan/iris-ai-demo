'use client'

import Link from 'next/link'

export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
        {/* 左側：ロゴ + ナビ */}
        <nav className="flex gap-8 items-center">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-white hover:text-indigo-400 transition"
          >
            IR投資AI
          </Link>
          <Link
            href="/companies"
            className="hover:text-indigo-400 transition font-medium"
          >
            企業
          </Link>
          <Link
            href="/ir-reports"
            className="hover:text-indigo-400 transition font-medium"
          >
            IR資料
          </Link>
          <Link
            href="/analyze"
            className="hover:text-indigo-400 transition font-medium"
          >
            AI分析
          </Link>
          <Link
            href="/portfolio"
            className="hover:text-indigo-400 transition font-medium"
          >
            ポートフォリオ
          </Link>
        </nav>

        {/* 右側：ログアウト */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 font-semibold transition"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
