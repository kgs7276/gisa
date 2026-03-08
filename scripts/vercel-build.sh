#!/bin/bash
# Vercel 빌드 전 실행: SQLite → PostgreSQL 스키마 전환 후 빌드
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
npx prisma generate
npx next build
