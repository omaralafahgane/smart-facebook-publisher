import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAIVariant, generateHashtags } from '@/lib/openai'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    const body = await request.json()
    const { tone = 'promotional' } = body

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'المنشور غير موجود' },
        { status: 404 }
      )
    }

    // توليد نسخة ذكية
    const aiVariant = await generateAIVariant(post.content, tone)

    // توليد هاشتاغات
    const hashtags = await generateHashtags(post.content)

    // تحديث المنشور
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        aiVariant,
        hashtags: JSON.stringify(hashtags),
      },
    })

    return NextResponse.json({
      success: true,
      post: updatedPost,
      aiVariant,
      hashtags,
    })
  } catch (error: any) {
    console.error('Error generating AI variant:', error)
    return NextResponse.json(
      { error: 'فشل توليد النسخة الذكية' },
      { status: 500 }
    )
  }
}
