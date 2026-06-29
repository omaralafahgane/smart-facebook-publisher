import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: جلب جميع المجموعات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')

    const groups = await prisma.group.findMany({
      where: pageId ? { pageId } : undefined,
      include: {
        posts: true,
      },
    })

    return NextResponse.json(groups)
  } catch (error: any) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'فشل جلب المجموعات' },
      { status: 500 }
    )
  }
}

// POST: إنشاء مجموعة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { groupUrl, groupName, category, pageId } = body

    if (!groupUrl || !pageId) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    const group = await prisma.group.create({
      data: {
        groupUrl,
        groupName,
        category,
        pageId,
        status: 'available',
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error: any) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء المجموعة' },
      { status: 500 }
    )
  }
}
