import { CheckCircle } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

interface Props {
  explanation: string
  aiSummary: string
  aiEvalStatus: string
}

export default function CorrectFeedback({ explanation, aiSummary, aiEvalStatus }: Props) {
  return (
    <div className="mt-4 rounded-2xl border-2 border-green-200 bg-green-50 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-green-100">
        <CheckCircle className="text-green-600" size={20} />
        <span className="font-semibold text-green-800">정답입니다!</span>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">기본 해설</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
        </div>

        {aiEvalStatus !== 'ERROR' && (
          <div className="border-t border-green-200 pt-4">
            <h4 className="text-sm font-semibold text-green-700 mb-2">✨ AI 핵심 요약</h4>
            {aiEvalStatus === 'PENDING' ? (
              <div className="flex items-center gap-2 py-2">
                <LoadingSpinner size="sm" />
                <span className="text-xs text-gray-400">AI 해설 불러오는 중...</span>
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {aiSummary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
