"use client"
import { useState, useEffect } from 'react'
import { SUBJECTS, SUBJECT_COLORS } from '../../lib/constants'
import TrendTopicCard from '../components/trends/TrendTopicCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import Link from 'next/link'

interface ExamTrend {
  id: string
  subject: string
  topic: string
  totalCount: number
  avgPerExam: number
  trendSummary: string | null
  predictedCount: number | null
  importance: string
  yearlyFrequency: string
}

interface ExpectedQuestion {
  id: string
  subject: string
  topic: string | null
  content: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: number
  explanation: string
}

const OPTION_LABELS = ['①', '②', '③', '④']

export default function TrendsPage() {
  const [activeSubject, setActiveSubject] = useState<string>('')
  const [trends, setTrends] = useState<ExamTrend[]>([])
  const [expected, setExpected] = useState<ExpectedQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showExpected, setShowExpected] = useState(false)

  useEffect(() => {
    setLoading(true)
    const qs = activeSubject ? `?subject=${encodeURIComponent(activeSubject)}` : ''
    Promise.all([
      fetch(`/api/trends${qs}`).then(r => r.json()),
      fetch(`/api/trends/expected-questions${qs}&limit=10`).then(r => r.json()),
    ]).then(([t, e]) => {
      setTrends(Array.isArray(t) ? t : [])
      setExpected(Array.isArray(e) ? e : [])
      setLoading(false)
    })
  }, [activeSubject])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">출제경향 분석</h1>
          <p className="text-sm text-gray-500 mt-1">AI가 분석한 과목별 출제 경향과 예상 문제</p>
        </div>
        <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600 underline">분석 실행 →</Link>
      </div>

      {/* 과목 필터 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveSubject('')}
          className={`px-3 py-1.5 rounded-full text-sm border-2 transition font-medium ${!activeSubject ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-200'}`}
        >
          전체
        </button>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`px-3 py-1.5 rounded-full text-xs border-2 transition font-medium ${activeSubject === s ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : `${SUBJECT_COLORS[s]} border-transparent`}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="md" text="경향 분석 불러오는 중..." /></div>
      ) : trends.length === 0 ? (
        <EmptyState
          title="출제 경향 데이터가 없습니다"
          description="관리자 페이지에서 기출문제를 등록하고 경향 분석을 실행해주세요."
          action={<Link href="/admin" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">관리자 페이지로 →</Link>}
        />
      ) : (
        <>
          {/* 경향 카드 */}
          <div className="grid gap-4 mb-8">
            {trends.map((t) => <TrendTopicCard key={t.id} trend={t} />)}
          </div>

          {/* 예상 문제 */}
          {expected.length > 0 && (
            <div>
              <button
                onClick={() => setShowExpected(!showExpected)}
                className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition mb-4"
              >
                {showExpected ? '예상 문제 숨기기' : `AI 예상 문제 보기 (${expected.length}개)`}
              </button>

              {showExpected && (
                <div className="flex flex-col gap-4">
                  {expected.map((q, i) => (
                    <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">예상 #{i + 1}</span>
                        {q.topic && <span className="text-xs text-gray-400">{q.topic}</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-4 whitespace-pre-wrap">{q.content}</p>
                      <div className="flex flex-col gap-2 mb-4">
                        {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-lg text-sm border ${idx + 1 === q.answer ? 'border-green-400 bg-green-50 text-green-800 font-medium' : 'border-gray-200 text-gray-700'}`}
                          >
                            <span className="font-semibold mr-2 text-indigo-600">{OPTION_LABELS[idx]}</span>{opt}
                          </div>
                        ))}
                      </div>
                      <details>
                        <summary className="text-xs text-indigo-600 cursor-pointer font-medium">해설 보기</summary>
                        <p className="mt-2 text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
