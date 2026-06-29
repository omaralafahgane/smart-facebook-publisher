import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addPublishJob } from '@/lib/queue'

// GET: جلب جميع المنشورات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const status = searchParams.get('status')

    const posts = await prisma.post.findMany({
      where: {
        pageId: pageId || undefined,
        status: status || undefined,
      },
      include: {
        page: true,
        groups: true,
        schedule: true,
        publishLogs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'فشل جلب المنشورات' },
      { status: 500 }
    )
  }
}

// POST: إنشاء منشور جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, imageUrl, videoUrl, pageId, groupIds, campaignId } = body

    if (!content || !pageId) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        videoUrl,
        pageId,
        campaignId,
        status: 'draft',
        groups: groupIds
          ? {
              connect: groupIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        groups: true,
        schedule: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء المنشور' },
      { status: 500 }
    )
  }
}
