import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()
const ADMIN_PASSWORD = "said2011"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await prisma.recipe.findUnique({ where: { id } })
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { password } = await req.json()
  
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'كلمة السر غلط' }, { status: 401 })
  }
  
  await prisma.recipe.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { password, ...data } = await req.json()
  
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'كلمة السر غلط' }, { status: 401 })
  }
  
  const updated = await prisma.recipe.update({ 
    where: { id }, 
    data: {
      name: data.name,
      ingredients: data.ingredients,
      steps: data.steps,
      time: data.time,
      difficulty: data.difficulty
    }
  })
  return NextResponse.json(updated)
}