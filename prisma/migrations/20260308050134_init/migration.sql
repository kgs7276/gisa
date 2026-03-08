-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "questionNo" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "answer" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "topic" TEXT,
    "isGenerated" BOOLEAN NOT NULL DEFAULT false,
    "sourceNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuizSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "subject" TEXT,
    "totalQ" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    "currentIdx" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "score" INTEGER,
    "totalTime" INTEGER,
    "yearFilter" INTEGER,
    "roundFilter" INTEGER,
    "userId" TEXT NOT NULL,
    "questionIds" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuizSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "selectedOption" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "aiExplanation" TEXT,
    "aiSummary" TEXT,
    "aiAnalysis" TEXT,
    "aiEvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "timeSpent" INTEGER,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExamTrend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "analysisYear" INTEGER NOT NULL,
    "yearlyFrequency" TEXT NOT NULL DEFAULT '{}',
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "avgPerExam" REAL NOT NULL DEFAULT 0.0,
    "trendSummary" TEXT,
    "predictedCount" INTEGER,
    "importance" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExamTrendQuestion" (
    "trendId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    PRIMARY KEY ("trendId", "questionId"),
    CONSTRAINT "ExamTrendQuestion_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "ExamTrend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExamTrendQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "totalAnswered" INTEGER NOT NULL DEFAULT 0,
    "totalCorrect" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Question_subject_idx" ON "Question"("subject");

-- CreateIndex
CREATE INDEX "Question_year_round_idx" ON "Question"("year", "round");

-- CreateIndex
CREATE INDEX "Question_topic_idx" ON "Question"("topic");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "Question_year_round_questionNo_key" ON "Question"("year", "round", "questionNo");

-- CreateIndex
CREATE INDEX "QuizSession_userId_idx" ON "QuizSession"("userId");

-- CreateIndex
CREATE INDEX "QuizSession_userId_status_idx" ON "QuizSession"("userId", "status");

-- CreateIndex
CREATE INDEX "UserAnswer_userId_idx" ON "UserAnswer"("userId");

-- CreateIndex
CREATE INDEX "UserAnswer_questionId_idx" ON "UserAnswer"("questionId");

-- CreateIndex
CREATE INDEX "UserAnswer_userId_isCorrect_idx" ON "UserAnswer"("userId", "isCorrect");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswer_sessionId_questionId_key" ON "UserAnswer"("sessionId", "questionId");

-- CreateIndex
CREATE INDEX "ExamTrend_subject_idx" ON "ExamTrend"("subject");

-- CreateIndex
CREATE INDEX "ExamTrend_importance_idx" ON "ExamTrend"("importance");

-- CreateIndex
CREATE UNIQUE INDEX "ExamTrend_subject_topic_key" ON "ExamTrend"("subject", "topic");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
