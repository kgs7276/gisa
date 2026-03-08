import { z } from 'zod'

export const createQuestionSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  round: z.number().int().min(1).max(3),
  subject: z.string().min(1),
  questionNo: z.number().int().min(1).max(100),
  content: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  answer: z.number().int().min(1).max(4),
  explanation: z.string().min(1),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional().default('MEDIUM'),
  tags: z.array(z.string()).optional().default([]),
  topic: z.string().optional(),
  isGenerated: z.boolean().optional().default(false),
  sourceNote: z.string().optional(),
})

export const createSessionSchema = z.object({
  mode: z.enum(['RANDOM', 'BY_SUBJECT', 'WRONG_REVIEW', 'MOCK_EXAM']),
  subject: z.string().optional(),
  totalQ: z.number().int().min(1).max(100).optional().default(10),
  yearFilter: z.number().int().optional(),
  roundFilter: z.number().int().optional(),
})

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOption: z.number().int().min(1).max(4),
  timeSpent: z.number().int().optional(),
})

export const seedQuestionsSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  count: z.number().int().min(1).max(20).optional().default(5),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional().default('MEDIUM'),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})
