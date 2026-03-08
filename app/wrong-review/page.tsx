"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { SUBJECTS, SUBJECT_COLORS } from '../../lib/constants'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import { getOptionLabel, getOptionText } from '../../lib/utils'

interface WrongAnswer {
  id: string
  selectedOption: number
  aiExplanation: string | null
  aiAnalysis: string | null
  question: {
    id: string
    content: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    answer: number
    explanation: string
    subject: string
    topic: string | null
  }
}

export default function WrongReviewPage() {
  const { data: session } = useSession()
  const [activeSubject, setActiveSubject] = useState<string>('')
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    setLoading(true)
    const qs = activeSubject ? `?subject=${encodeURIComponent(activeSubject)}` : ''
    fetch(`/api/user/wrong-questions${qs}&limit=30`)
      .then(r => r.json())
      .then(data => {
        setWrongAnswers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [session, activeSubject])

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <Link href="/signin" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm">로그인</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">오답 복습</h1>
          <p className="text-sm text-gray-500 mt-1">틀린 문제들을 다시 확인하세요.</p>
        </div>
        <Link
          href="/quiz"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
        >
          오답 퀴즈 →
        </Link>
      </div>

      {/* 과목 필터 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveSubject('')}
          className={`px-3 py-1.5 rounded-full text-sm border-2 transition font-medium ${!activeSubject ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}
        >
          전체 ({wrongAnswers.length})
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
        <div className="flex justify-center py-12"><LoadingSpinner size="md" /></div>
      ) : wrongAnswers.length === 0 ? (
        <EmptyState
          title="오답이 없습니다!"
          description="퀴즈를 풀어서 틀린 문제를 모아보세요."
          action={<Link href="/quiz" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">퀴즈 시작</Link>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {wrongAnswers.map((wa) => (
            <div key={wa.id} className="bg-white rounded-xl border-2 border-red-200 p-5">
              <p className="text-xs text-gray-400 mb-2">{wa.question.subject}{wa.question.topic ? ` · ${wa.question.topic}` : ''}</p>
              <p className="text-sm font-medium text-gray-900 mb-4 whitespace-pre-wrap">{wa.question.content}</p>

              <div className="flex flex-col gap-2 mb-3">
                {[wa.question.optionA, wa.question.optionB, wa.question.optionC, wa.question.optionD].map((opt, idx) => {
                  const num = idx + 1
                  const isCorrect = num === wa.question.answer
                  const isWrong = num === wa.selectedOption && !isCorrect
                  return (
                    <div
                      key={idx}
                      className={`px-3 py-2 rounded-lg text-sm border ${
                        isCorrect ? 'border-green-400 bg-green-50 text-green-800 font-medium' :
                        isWrong ? 'border-red-400 bg-red-50 text-red-700' :
                        'border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="font-semibold mr-2 text-indigo-600">{getOptionLabel(num)}</span>{opt}
                      {isCorrect && <span className="ml-2 text-green-600 text-xs">✓ 정답</span>}
                      {isWrong && <span className="ml-2 text-red-500 text-xs">✗ 내 선택</span>}
                    </div>
                  )
                })}
              </div>

              <details>
                <summary className="text-xs text-indigo-600 cursor-pointer font-medium mb-1">기본 해설 보기</summary>
                <p className="text-xs text-gray-600 leading-relaxed">{wa.question.explanation}</p>
              </details>

              {wa.aiAnalysis && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer font-medium">AI 오답 분석 보기</summary>
                  <div className="mt-2 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap bg-red-50 rounded-lg p-3">
                    {wa.aiAnalysis}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
