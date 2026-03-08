"use client"
import { SUBJECT_COLORS } from '../../../lib/constants'

interface Question {
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

interface Props {
  question: Question
  onAnswer: (option: number) => void
  disabled?: boolean
  selectedOption?: number | null
  correctAnswer?: number | null
}

const OPTIONS = [
  { num: 1, label: '①' },
  { num: 2, label: '②' },
  { num: 3, label: '③' },
  { num: 4, label: '④' },
]

function getOptionText(q: Question, num: number) {
  const map: Record<number, string> = { 1: q.optionA, 2: q.optionB, 3: q.optionC, 4: q.optionD }
  return map[num] ?? ''
}

export default function QuestionCard({ question, onAnswer, disabled, selectedOption, correctAnswer }: Props) {
  const subjectColor = SUBJECT_COLORS[question.subject] ?? 'bg-gray-100 text-gray-700'

  function getOptionClass(num: number) {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 '
    if (!disabled) return base + 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
    if (num === correctAnswer) return base + 'border-green-500 bg-green-50 text-green-800 font-medium'
    if (num === selectedOption && num !== correctAnswer) return base + 'border-red-400 bg-red-50 text-red-700'
    return base + 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${subjectColor}`}>
          {question.subject}
        </span>
        {question.topic && (
          <span className="text-xs text-gray-400">{question.topic}</span>
        )}
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
          question.difficulty === 'HARD' ? 'bg-red-100 text-red-700' :
          question.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {question.difficulty === 'HARD' ? '어려움' : question.difficulty === 'EASY' ? '쉬움' : '보통'}
        </span>
      </div>

      <p className="text-gray-900 font-medium leading-relaxed mb-6 whitespace-pre-wrap">
        {question.content}
      </p>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ num, label }) => (
          <button
            key={num}
            onClick={() => !disabled && onAnswer(num)}
            disabled={disabled}
            className={getOptionClass(num)}
          >
            <span className="font-semibold mr-2 text-indigo-600">{label}</span>
            {getOptionText(question, num)}
          </button>
        ))}
      </div>
    </div>
  )
}
