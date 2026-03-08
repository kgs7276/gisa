import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '../../../../lib/validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
