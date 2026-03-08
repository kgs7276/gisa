import { XCircle } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

interface Props {
  explanation: string
  aiAnalysis: string
  aiEvalStatus: string
  correctAnswer: number
  selectedOption: number
}

const OPTION_LABELS: Record<number, string> = { 1: '①', 2: '②', 3: '③', 4: '④' }

export default function IncorrectFeedback({ explanation, aiAnalysis, aiEvalStatus, correctAnswer, selectedOption }: Props) {
  return (
    <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-red-100">
        <XCircle className="text-red-600" size={20} />
        <span className="font-semibold text-red-800">
          오답입니다. 선택: {OPTION_LABELS[selectedOption]}  |  정답: {OPTION_LABELS[correctAnswer]}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">기본 해설</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
        </div>

        {aiEvalStatus !== 'ERROR' && (
          <div className="border-t border-red-200 pt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">🤖 AI 오답 분석</h4>
            {aiEvalStatus === 'PENDING' ? (
              <div className="flex items-center gap-2 py-2">
                <LoadingSpinner size="sm" />
                <span className="text-xs text-gray-400">AI가 분석 중...</span>
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
