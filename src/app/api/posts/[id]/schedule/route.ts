import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addPublishJob } from '@/lib/queue'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const body = await request.json()
    const { scheduledTime, type = 'custom', recurrenceRule } = body

    if (!scheduledTime) {
      return NextResponse.json(
        { error: 'وقت الجدولة مطلوب' },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'المنشور غير موجود' },
        { status: 404 }
      )
    }

    // إنشاء جدولة
    const schedule = await prisma.schedule.create({
      data: {
        postId,
        type,
        scheduledTime: new Date(scheduledTime),
        recurrenceRule,
        isActive: true,
      },
    })

    // حساب التأخير بالميلي ثانية
    const delay = new Date(scheduledTime).getTime() - Date.now()

    // إضافة المهمة إلى الطابور
    if (delay > 0) {
      await addPublishJob(postId, delay)
    }

    // تحديث حالة المنشور
    await prisma.post.update({
      where: { id: postId },
      data: { status: 'scheduled' },
    })

    return NextResponse.json({
      success: true,
      schedule,
      message: 'تم جدولة المنشور بنجاح',
    })
  } catch (error: any) {
    console.error('Error scheduling post:', error)
    return NextResponse.json(
      { error: 'فشل جدولة المنشور' },
      { status: 500 }
    )
  }
}

// GET: الحصول على جدولة المنشور
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    const schedule = await prisma.schedule.findUnique({
      where: { postId },
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'لا توجد جدولة لهذا المنشور' },
        { status: 404 }
      )
    }

    return NextResponse.json(schedule)
  } catch (error: any) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'فشل جلب الجدولة' },
      { status: 500 }
    )
  }
}
