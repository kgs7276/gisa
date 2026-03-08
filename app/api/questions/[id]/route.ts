import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import { getCurrentUser } from '../../../../lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const question = await prisma.question.findUnique({ where: { id } })
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(question)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const body = await req.json()
  const question = await prisma.question.update({ where: { id }, data: body })
  return NextResponse.json(question)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  await prisma.question.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
