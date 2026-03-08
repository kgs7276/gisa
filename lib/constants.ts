export const SUBJECTS = [
  '소프트웨어 설계',
  '소프트웨어 개발',
  '데이터베이스 구축',
  '프로그래밍 언어 활용',
  '정보시스템 구축 관리',
] as const

export type Subject = typeof SUBJECTS[number]

export const QUIZ_MODES = ['RANDOM', 'BY_SUBJECT', 'WRONG_REVIEW', 'MOCK_EXAM'] as const
export type QuizMode = typeof QUIZ_MODES[number]

export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const
export type Difficulty = typeof DIFFICULTIES[number]

export const AI_EVAL_STATUS = ['PENDING', 'DONE', 'ERROR'] as const
export type AiEvalStatus = typeof AI_EVAL_STATUS[number]

export const SESSION_STATUS = ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'] as const
export type SessionStatus = typeof SESSION_STATUS[number]

export const IMPORTANCE = ['HIGH', 'MEDIUM', 'LOW'] as const
export type Importance = typeof IMPORTANCE[number]

export const SUBJECT_COLORS: Record<string, string> = {
  '소프트웨어 설계': 'bg-blue-100 text-blue-800',
  '소프트웨어 개발': 'bg-green-100 text-green-800',
  '데이터베이스 구축': 'bg-yellow-100 text-yellow-800',
  '프로그래밍 언어 활용': 'bg-purple-100 text-purple-800',
  '정보시스템 구축 관리': 'bg-red-100 text-red-800',
}

export const SUBJECT_TOPICS: Record<string, string[]> = {
  '소프트웨어 설계': ['요구사항 분석', 'UML 다이어그램', '디자인 패턴', '아키텍처 설계', '인터페이스 설계'],
  '소프트웨어 개발': ['자료구조', '알고리즘', '테스트', '소스코드 품질', '빌드 및 배포'],
  '데이터베이스 구축': ['SQL', '데이터 모델링', '정규화', '트랜잭션', '데이터베이스 설계'],
  '프로그래밍 언어 활용': ['Python', 'Java', 'C언어', '운영체제', '네트워크'],
  '정보시스템 구축 관리': ['소프트웨어 공학', '보안', '프로젝트 관리', '시스템 분석', 'IT 거버넌스'],
}
