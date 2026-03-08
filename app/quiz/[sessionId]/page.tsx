"use client"
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import QuestionCard from '../../components/quiz/QuestionCard'
import QuizProgress from '../../components/quiz/QuizProgress'
import CorrectFeedback from '../../components/quiz/CorrectFeedback'
import IncorrectFeedback from '../../components/quiz/IncorrectFeedback'
import LoadingSpinner from '../../components/common/LoadingSpinner'

interface SessionData {
  id: string
  totalQ: number
  currentIdx: number
  status: string
  questionIdsList: string[]
}

interface QuestionData {
  id: string
  content: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  subject: string
  topic: string | null
  difficulty: string
}

interface AnswerResult {
  isCorrect: boolean
  correctAnswer: number
  question: { explanation: string }
  userAnswerId: string
}

interface AiEvalData {
  aiEvalStatus: string
  aiSummary: string
  aiAnalysis: string
}

export default function QuizPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params
  const router = useRouter()

  const [session, setSession] = useState<SessionData | null>(null)
  const [question, setQuestion] = useState<QuestionData | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [aiEval, setAiEval] = useState<AiEvalData | null>(null)
  const [loading, setLoading] = useState(true)

  // 세션 로드
  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setSession(data)
        setQuestionIndex(data.currentIdx ?? 0)
        loadQuestion(data.questionIdsList[data.currentIdx ?? 0])
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  async function loadQuestion(questionId: string) {
    if (!questionId) return
    const res = await fetch(`/api/questions/${questionId}`)
    const data = await res.json()
    setQuestion(data)
    setAnswered(false)
    setSelectedOption(null)
    setAnswerResult(null)
    setAiEval(null)
  }

  const pollAiEval = useCallback(async (qId: string, maxRetries = 12) => {
    for (let i = 0; i < maxRetries; i++) {
      await new Promise((r) => setTimeout(r, 1500))
      const res = await fetch(`/api/sessions/${sessionId}/answers/${qId}`)
      const data: AiEvalData = await res.json()
      if (data.aiEvalStatus !== 'PENDING') {
        setAiEval(data)
        return
      }
    }
    setAiEval({ aiEvalStatus: 'ERROR', aiSummary: '', aiAnalysis: '' })
  }, [sessionId])

  async function handleAnswer(option: number) {
    if (answered || !question || !session) return
    setSelectedOption(option)
    setAnswered(true)

    const res = await fetch(`/api/sessions/${sessionId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, selectedOption: option }),
    })
    const data: AnswerResult = await res.json()
    setAnswerResult(data)
    setAiEval({ aiEvalStatus: 'PENDING', aiSummary: '', aiAnalysis: '' })

    // 백그라운드 폴링
    pollAiEval(question.id)
  }

  async function handleNext() {
    if (!session) return
    const nextIdx = questionIndex + 1
    if (nextIdx >= session.questionIdsList.length) {
      // 세션 완료
      const correctCount = await fetch(`/api/sessions/${sessionId}`)
        .then(r => r.json())
        .then(d => d.answers?.filter((a: { isCorrect: boolean }) => a.isCorrect).length ?? 0)
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', score: correctCount }),
      })
      router.push(`/quiz/${sessionId}/results`)
      return
    }
    setQuestionIndex(nextIdx)
    loadQuestion(session.questionIdsList[nextIdx])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="퀴즈 불러오는 중..." />
      </div>
    )
  }

  if (!session || !question) {
    return <div className="text-center py-16 text-gray-400">세션을 찾을 수 없습니다.</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <QuizProgress current={questionIndex + (answered ? 1 : 0)} total={session.totalQ} />

      <QuestionCard
        question={question}
        onAnswer={handleAnswer}
        disabled={answered}
        selectedOption={selectedOption}
        correctAnswer={answerResult?.correctAnswer ?? null}
      />

      {answered && answerResult && (
        <>
          {answerResult.isCorrect ? (
            <CorrectFeedback
              explanation={answerResult.question.explanation}
              aiSummary={aiEval?.aiSummary ?? ''}
              aiEvalStatus={aiEval?.aiEvalStatus ?? 'PENDING'}
            />
          ) : (
            <IncorrectFeedback
              explanation={answerResult.question.explanation}
              aiAnalysis={aiEval?.aiAnalysis ?? ''}
              aiEvalStatus={aiEval?.aiEvalStatus ?? 'PENDING'}
              correctAnswer={answerResult.correctAnswer}
              selectedOption={selectedOption!}
            />
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
            >
              {questionIndex + 1 >= session.totalQ ? '결과 보기 →' : '다음 문제 →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
