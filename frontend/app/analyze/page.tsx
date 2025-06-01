'use client'

import { useState } from 'react'

export default function AnalyzePage() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    setSummary('')
    setSentiment('')

    const token = localStorage.getItem('token')

    try {
      // RAG 要約
      const ragRes = await fetch('http://localhost:8000/analysis/rag', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!ragRes.ok) throw new Error('RAG要約に失敗')

      const ragData = await ragRes.json()
      setSummary(ragData.summary)

      // センチメント分析
      const sentimentRes = await fetch('http://localhost:8000/analysis/sentiment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!sentimentRes.ok) throw new Error('センチメント分析に失敗')

      const sentimentData = await sentimentRes.json()
      console.log('センチメントデータ:', sentimentData) // ← 追加！
      setSentiment(sentimentData.sentiment)
    } catch (err: any) {
      setError(err.message || '分析中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>AI分析</h1>

      <textarea
        rows={6}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="分析したい文章を入力してください"
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={handleAnalyze} disabled={loading} style={{ width: '100%' }}>
        {loading ? '分析中...' : '分析する'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h2>🧠 RAG要約</h2>
          <p>{summary}</p>
        </div>
      )}

      {sentiment && (
        <div style={{ marginTop: '2rem' }}>
          <h2>😊 センチメント結果</h2>
          <p>{sentiment}</p>
        </div>
      )}
    </div>
  )
}
