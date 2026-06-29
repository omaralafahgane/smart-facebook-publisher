import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishPost, publishToGroup } from '@/lib/facebook'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        page: true,
        groups: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'المنشور غير موجود' },
        { status: 404 }
      )
    }

    if (!post.page) {
      return NextResponse.json(
        { error: 'الصفحة غير موجودة' },
        { status: 404 }
      )
    }

    const publishLogs = []

    // نشر على الصفحة
    try {
      const pageResult = await publishPost(
        post.page.facebookPageId,
        post.page.accessToken,
        post.content,
        post.imageUrl || undefined
      )

      const log = await prisma.publishLog.create({
        data: {
          postId,
          pageId: post.pageId,
          status: 'success',
          facebookPostId: pageResult.id,
          publishedAt: new Date(),
        },
      })

      publishLogs.push(log)
    } catch (error: any) {
      const log = await prisma.publishLog.create({
        data: {
          postId,
          pageId: post.pageId,
          status: 'failed',
          errorMessage: error.message,
        },
      })

      publishLogs.push(log)
    }

    // نشر على المجموعات
    for (const group of post.groups) {
      try {
        const groupResult = await publishToGroup(
          group.id,
          post.page.accessToken,
          post.content,
          post.imageUrl || undefined
        )

        const log = await prisma.publishLog.create({
          data: {
            postId,
            pageId: post.pageId,
            status: 'success',
            facebookPostId: groupResult.id,
            publishedAt: new Date(),
          },
        })

        publishLogs.push(log)
      } catch (error: any) {
        const log = await prisma.publishLog.create({
          data: {
            postId,
            pageId: post.pageId,
            status: 'failed',
            errorMessage: error.message,
          },
        })

        publishLogs.push(log)
      }
    }

    // تحديث حالة المنشور
    await prisma.post.update({
      where: { id: postId },
      data: { status: 'published' },
    })

    return NextResponse.json({
      success: true,
      post: { ...post, status: 'published' },
      publishLogs,
    })
  } catch (error: any) {
    console.error('Error publishing post:', error)
    return NextResponse.json(
      { error: 'فشل نشر المنشور' },
      { status: 500 }
    )
  }
}
