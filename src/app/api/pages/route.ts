import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: جلب جميع الصفحات
export async function GET(request: NextRequest) {
  try {
    const pages = await prisma.page.findMany({
      include: {
        groups: true,
        posts: true,
      },
    })

    return NextResponse.json(pages)
  } catch (error: any) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'فشل جلب الصفحات' },
      { status: 500 }
    )
  }
}

// POST: إنشاء صفحة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { facebookPageId, pageName, pageUrl, accessToken, facebookAccountId } = body

    if (!facebookPageId || !pageName || !facebookAccountId) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        facebookPageId,
        pageName,
        pageUrl,
        accessToken,
        facebookAccountId,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error: any) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء الصفحة' },
      { status: 500 }
    )
  }
}
