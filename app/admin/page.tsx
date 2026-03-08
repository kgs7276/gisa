"use client"
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { SUBJECTS, SUBJECT_TOPICS } from '../../lib/constants'

interface SeedResult {
  generated: number
  saved: number
}

interface TrendResult {
  results: Array<{ subject: string; trendsUpdated?: number; error?: string }>
}

export default function AdminPage() {
  const { data: session } = useSession()

  // 문제 생성 상태
  const [seedSubject, setSeedSubject] = useState('')
  const [seedTopic, setSeedTopic] = useState('')
  const [seedCount, setSeedCount] = useState(5)
  const [seedDifficulty, setSeedDifficulty] = useState('MEDIUM')
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null)
  const [seedError, setSeedError] = useState('')

  // 경향 분석 상태
  const [trendSubject, setTrendSubject] = useState('')
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendResult, setTrendResult] = useState<TrendResult | null>(null)
  const [trendError, setTrendError] = useState('')

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <Link href="/signin" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm">로그인</Link>
      </div>
    )
  }

  async function handleSeed() {
    if (!seedSubject || !seedTopic) { setSeedError('과목과 주제를 선택해주세요.'); return }
    setSeedLoading(true)
    setSeedResult(null)
    setSeedError('')

    const res = await fetch('/api/admin/seed-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: seedSubject, topic: seedTopic, count: seedCount, difficulty: seedDifficulty }),
    })
    const data = await res.json()
    setSeedLoading(false)
    if (!res.ok) setSeedError(data.error ?? '실패')
    else setSeedResult(data)
  }

  async function handleAnalyzeTrends() {
    setTrendLoading(true)
    setTrendResult(null)
    setTrendError('')

    const qs = trendSubject ? `?subject=${encodeURIComponent(trendSubject)}` : ''
    const res = await fetch(`/api/admin/analyze-trends${qs}`, { method: 'POST' })
    const data = await res.json()
    setTrendLoading(false)
    if (!res.ok) setTrendError(data.error ?? '실패')
    else setTrendResult(data)
  }

  const topics = seedSubject ? (SUBJECT_TOPICS[seedSubject] ?? []) : []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자</h1>
      <p className="text-gray-500 text-sm mb-8">문제 생성 및 경향 분석을 관리합니다. ANTHROPIC_API_KEY가 설정되어 있어야 합니다.</p>

      {/* 문제 생성 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">AI 문제 생성</h2>
        <p className="text-sm text-gray-500 mb-4">Claude AI가 과목/주제별 4지선다 문제를 생성합니다.</p>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">과목</label>
            <select
              value={seedSubject}
              onChange={(e) => { setSeedSubject(e.target.value); setSeedTopic('') }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">과목 선택</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {topics.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주제</label>
              <select
                value={seedTopic}
                onChange={(e) => setSeedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">주제 선택</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">문제 수</label>
              <select
                value={seedCount}
                onChange={(e) => setSeedCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n}문제</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">난이도</label>
              <select
                value={seedDifficulty}
                onChange={(e) => setSeedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="EASY">쉬움</option>
                <option value="MEDIUM">보통</option>
                <option value="HARD">어려움</option>
              </select>
            </div>
          </div>

          {seedError && <p className="text-sm text-red-600">{seedError}</p>}
          {seedResult && (
            <div className="bg-green-50 text-green-700 rounded-lg px-4 py-3 text-sm">
              성공: {seedResult.generated}개 생성 → {seedResult.saved}개 저장
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={seedLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {seedLoading ? 'AI가 문제를 생성 중...' : '문제 생성 시작'}
          </button>
        </div>
      </div>

      {/* 경향 분석 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">출제경향 분석</h2>
        <p className="text-sm text-gray-500 mb-4">기출문제 데이터를 AI로 분석하여 출제 경향을 업데이트합니다.</p>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">분석 과목 (선택)</label>
            <select
              value={trendSubject}
              onChange={(e) => setTrendSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">전체 과목</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {trendError && <p className="text-sm text-red-600">{trendError}</p>}
          {trendResult && (
            <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-3 text-sm">
              {trendResult.results.map((r, i) => (
                <div key={i}>
                  {r.subject}: {r.error ? `실패 - ${r.error}` : `${r.trendsUpdated}개 주제 업데이트`}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAnalyzeTrends}
            disabled={trendLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {trendLoading ? 'AI가 분석 중... (수분 소요)' : '출제경향 분석 시작'}
          </button>
        </div>
      </div>
    </div>
  )
}
