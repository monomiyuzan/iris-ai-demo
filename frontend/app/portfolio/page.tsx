'use client'

import { useEffect, useState } from 'react'

type PortfolioItem = {
  id: number
  company: string
  shares: number
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [newCompany, setNewCompany] = useState('')
  const [newShares, setNewShares] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editCompany, setEditCompany] = useState('')
  const [editShares, setEditShares] = useState(0)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    const res = await fetch('http://localhost:8000/portfolio', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setPortfolio(data)
  }

  const handleAdd = async () => {
    const res = await fetch('http://localhost:8000/portfolio', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company: newCompany, shares: newShares }),
    })
    if (res.ok) {
      setNewCompany('')
      setNewShares(0)
      fetchPortfolio()
    }
  }

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/portfolio/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPortfolio()
  }

  const startEdit = (item: PortfolioItem) => {
    setEditingId(item.id)
    setEditCompany(item.company)
    setEditShares(item.shares)
  }

  const handleEditSave = async () => {
    await fetch(`http://localhost:8000/portfolio/${editingId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editingId, company: editCompany, shares: editShares }),
    })
    setEditingId(null)
    fetchPortfolio()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 ポートフォリオ管理</h1>

      {/* 登録フォーム */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="企業名"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="株数"
          value={newShares}
          onChange={(e) => setNewShares(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
          追加
        </button>
      </div>

      {/* 一覧 + 編集・削除 */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">企業名</th>
            <th className="py-2 px-4 border">株数</th>
            <th className="py-2 px-4 border">操作</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">
                {editingId === item.id ? (
                  <input
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  item.company
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editShares}
                    onChange={(e) => setEditShares(Number(e.target.value))}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  item.shares
                )}
              </td>
              <td className="border px-4 py-2 flex gap-2">
                {editingId === item.id ? (
                  <button
                    onClick={handleEditSave}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    保存
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    編集
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
