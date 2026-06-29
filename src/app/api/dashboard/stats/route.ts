import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')

    const where = pageId ? { pageId } : {}

    // إحصائيات المنشورات
    const totalPosts = await prisma.post.count({ where })
    const publishedPosts = await prisma.post.count({
      where: { ...where, status: 'published' },
    })
    const scheduledPosts = await prisma.post.count({
      where: { ...where, status: 'scheduled' },
    })
    const draftPosts = await prisma.post.count({
      where: { ...where, status: 'draft' },
    })

    // إحصائيات المجموعات
    const totalGroups = await prisma.group.count({ where })

    // إحصائيات الحملات
    const totalCampaigns = await prisma.campaign.count({ where })

    // آخر المنشورات
    const recentPosts = await prisma.post.findMany({
      where,
      include: {
        groups: true,
        publishLogs: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // إحصائيات النشر
    const publishStats = await prisma.publishLog.groupBy({
      by: ['status'],
      where: { page: pageId ? { facebookPageId: pageId } : undefined },
      _count: true,
    })

    return NextResponse.json({
      stats: {
        totalPosts,
        publishedPosts,
        scheduledPosts,
        draftPosts,
        totalGroups,
        totalCampaigns,
      },
      recentPosts,
      publishStats,
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'فشل جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
