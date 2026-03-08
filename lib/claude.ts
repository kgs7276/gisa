import Anthropic from '@anthropic-ai/sdk'
import { getOptionText } from './utils'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface GeneratedQuestion {
  content: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: number
  explanation: string
  difficulty: string
  tags: string[]
  topic: string
}

export interface EvaluationResult {
  aiSummary: string
  aiAnalysis: string
  aiExplanation: string
}

export interface TrendAnalysisResult {
  trends: Array<{
    topic: string
    trendSummary: string
    predictedCount: number
    importance: 'HIGH' | 'MEDIUM' | 'LOW'
    studyTips: string
  }>
  overallInsight: string
  hotTopics: string[]
}

// 정답 시: 핵심 요약 생성
// 오답 시: 오답 분석 + 정답 해설 생성
export async function evaluateAnswer(params: {
  isCorrect: boolean
  subject: string
  topic: string | null
  content: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: number
  selectedOption: number
}): Promise<EvaluationResult> {
  const { isCorrect, subject, topic, content, answer, selectedOption } = params
  const questionObj = {
    optionA: params.optionA,
    optionB: params.optionB,
    optionC: params.optionC,
    optionD: params.optionD,
  }
  const correctText = getOptionText(questionObj, answer)
  const selectedText = getOptionText(questionObj, selectedOption)

  const optionsList = `① ${params.optionA}\n② ${params.optionB}\n③ ${params.optionC}\n④ ${params.optionD}`

  let userPrompt: string

  if (isCorrect) {
    userPrompt = `[과목] ${subject}
[주제] ${topic ?? '일반'}
[문제] ${content}

보기:
${optionsList}

정답: ${answer}번 - ${correctText}

사용자가 정답(${answer}번)을 선택했습니다.

다음 형식으로 핵심 정리를 작성하세요:

## 핵심 요약
[2-3문장으로 이 문제의 핵심 개념 설명]

## 기억할 키워드
- [키워드 1]: [한 줄 설명]
- [키워드 2]: [한 줄 설명]

## 관련 출제 포인트
[시험에서 자주 변형되어 출제되는 방식 1-2가지]`
  } else {
    userPrompt = `[과목] ${subject}
[주제] ${topic ?? '일반'}
[문제] ${content}

보기:
${optionsList}

정답: ${answer}번 - ${correctText}
사용자가 선택한 답: ${selectedOption}번 - ${selectedText}

다음 형식으로 분석을 작성하세요:

## 오답 분석
[사용자가 ${selectedOption}번을 선택한 이유를 추측하고, 해당 보기가 왜 틀렸는지 설명 (2-3문장)]

## 정답 해설
[${answer}번이 정답인 이유를 명확하게 설명 (3-4문장)]

## 핵심 개념 정리
[이 문제의 핵심 개념을 간략히 정리 (불릿 포인트 2-3개)]

## 혼동하기 쉬운 함정
[비슷한 문제에서 자주 틀리는 부분 설명]`
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 800,
    temperature: 0.3,
    system: `당신은 정보처리기사 시험 전문 튜터입니다. 학습자에게 친절하고 명확하게 설명하세요. 반드시 한국어로 답변하세요.`,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const fullText = message.content[0].type === 'text' ? message.content[0].text : ''

  if (isCorrect) {
    return {
      aiSummary: fullText,
      aiAnalysis: '',
      aiExplanation: fullText,
    }
  } else {
    return {
      aiSummary: '',
      aiAnalysis: fullText,
      aiExplanation: fullText,
    }
  }
}

// 과목/주제별 문제 생성 (관리자용)
export async function generateQuestions(params: {
  subject: string
  topic: string
  count: number
  difficulty: string
}): Promise<GeneratedQuestion[]> {
  const { subject, topic, count, difficulty } = params

  const prompt = `정보처리기사 ${subject} 과목의 "${topic}" 주제에 대해 ${count}개의 4지선다 문제를 생성하세요.

요구사항:
- 난이도: ${difficulty}
- 2020년 NCS 기반 출제 기준 준수
- 실제 기출 문제와 유사한 어조와 형식 사용
- 각 보기는 명확히 구분 가능해야 함
- 정답은 1~4 중 하나 (균등하게 분포)
- explanation은 2-3문장으로 명확하게 작성

반드시 아래 JSON 배열 형식으로만 응답하고 다른 텍스트는 포함하지 마세요:
[
  {
    "content": "문제 본문",
    "optionA": "보기 ①",
    "optionB": "보기 ②",
    "optionC": "보기 ③",
    "optionD": "보기 ④",
    "answer": 2,
    "explanation": "상세 해설",
    "difficulty": "${difficulty}",
    "tags": ["태그1", "태그2"],
    "topic": "${topic}"
  }
]`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    temperature: 0.7,
    system: `당신은 정보처리기사 시험 문제 출제 전문가입니다. 반드시 유효한 JSON 배열 형식으로만 응답하세요.`,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'

  // JSON 추출 (마크다운 코드블록 제거)
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const parsed = JSON.parse(jsonMatch[0]) as GeneratedQuestion[]
  return parsed
}

// 출제 경향 분석 (관리자용)
export async function analyzeTrends(params: {
  subject: string
  topicData: Record<string, Record<string, number>>
  analysisRange: string
}): Promise<TrendAnalysisResult> {
  const { subject, topicData, analysisRange } = params

  const prompt = `다음은 정보처리기사 ${subject} 과목의 최근 기출 문제 분류 데이터입니다:

${JSON.stringify(topicData, null, 2)}

(형식: { "주제명": { "연도": 출제수 } })
분석 기간: ${analysisRange}

다음 JSON 형식으로만 응답하세요:
{
  "trends": [
    {
      "topic": "주제명",
      "trendSummary": "출제 경향 요약 (1-2문장)",
      "predictedCount": 3,
      "importance": "HIGH",
      "studyTips": "학습 포인트"
    }
  ],
  "overallInsight": "과목 전체 출제 경향 총평 (2-3문장)",
  "hotTopics": ["주제1", "주제2", "주제3"]
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    temperature: 0.2,
    system: `당신은 정보처리기사 시험 출제 경향 분석 전문가입니다. 반드시 유효한 JSON 형식으로만 응답하세요. 한국어로 작성하세요.`,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { trends: [], overallInsight: '', hotTopics: [] }
  }

  return JSON.parse(jsonMatch[0]) as TrendAnalysisResult
}
