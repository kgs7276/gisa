"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'
import LoadingSpinner from '../../../components/common/LoadingSpinner'
import { accuracyPercent, getOptionLabel, getOptionText } from '../../../../lib/utils'

interface Answer {
  id: string
  isCorrect: boolean
  selectedOption: number
  aiExplanation: string | null
  aiEvalStatus: string
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

interface Session {
  id: string
  totalQ: number
  score: number | null
  mode: string
  answers: Answer[]
}

export default function ResultsPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [wrongOnly, setWrongOnly] = useState(false)

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => { setSession(data); setLoading(false) })
  }, [sessionId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" text="결과 불러오는 중..." />
    </div>
  )

  if (!session) return <div className="text-center py-16 text-gray-400">세션을 찾을 수 없습니다.</div>

  const correct = session.answers.filter(a => a.isCorrect).length
  const total = session.answers.length
  const pct = accuracyPercent(correct, total)
  const filtered = wrongOnly ? session.answers.filter(a => !a.isCorrect) : session.answers

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 점수 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center">
        <Trophy className="mx-auto text-yellow-500 mb-3" size={40} />
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{pct}점</h1>
        <p className="text-gray-500 mb-4">{total}문제 중 {correct}개 정답</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${pct >= 60 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct >= 60 ? (
          <p className="mt-3 text-green-600 text-sm font-medium">합격 기준(60점) 통과!</p>
        ) : (
          <p className="mt-3 text-red-500 text-sm font-medium">합격 기준(60점)에 미달. 더 연습이 필요합니다.</p>
        )}
      </div>

      {/* 필터 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">문제 목록</h2>
        <button
          onClick={() => setWrongOnly(!wrongOnly)}
          className={`text-sm px-3 py-1.5 rounded-lg border transition ${wrongOnly ? 'border-red-400 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600'}`}
        >
          {wrongOnly ? '전체 보기' : '오답만 보기'}
        </button>
      </div>

      {/* 답안 목록 */}
      <div className="flex flex-col gap-4">
        {filtered.map((answer, idx) => (
          <div key={answer.id} className={`bg-white rounded-xl border-2 p-5 ${answer.isCorrect ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex items-start gap-2 mb-3">
              {answer.isCorrect
                ? <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                : <XCircle className="text-red-500 mt-0.5 shrink-0" size={18} />}
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">{answer.question.subject}{answer.question.topic ? ` · ${answer.question.topic}` : ''}</p>
                <p className="text-sm text-gray-900 font-medium whitespace-pre-wrap">{answer.question.content}</p>
              </div>
            </div>

            {!answer.isCorrect && (
              <div className="bg-red-50 rounded-lg px-4 py-2 mb-3 text-sm">
                <span className="text-red-600">내 답: {getOptionLabel(answer.selectedOption)} {getOptionText(answer.question, answer.selectedOption)}</span>
                <br />
                <span className="text-green-700">정답: {getOptionLabel(answer.question.answer)} {getOptionText(answer.question, answer.question.answer)}</span>
              </div>
            )}

            {answer.aiExplanation && (
              <details className="mt-2">
                <summary className="text-xs text-indigo-600 cursor-pointer font-medium">AI 해설 보기</summary>
                <div className="mt-2 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                  {answer.aiExplanation}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Link href="/quiz" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium text-center hover:bg-indigo-700 transition">
          다시 풀기
        </Link>
        <Link href="/" className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-medium text-center hover:bg-gray-50 transition">
          홈으로
        </Link>
      </div>
    </div>
  )
}
