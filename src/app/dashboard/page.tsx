'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  stats: {
    totalPosts: number
    publishedPosts: number
    scheduledPosts: number
    draftPosts: number
    totalGroups: number
    totalCampaigns: number
  }
  recentPosts: any[]
  publishStats: any[]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error('فشل جلب الإحصائيات')
      }
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = stats
    ? [
        { label: 'المنشورات', value: stats.stats.totalPosts, icon: '📄' },
        { label: 'المجموعات', value: stats.stats.totalGroups, icon: '👥' },
        { label: 'الحملات', value: stats.stats.totalCampaigns, icon: '📢' },
        { label: 'المنشورة', value: stats.stats.publishedPosts, icon: '✅' },
      ]
    : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'منشورة'
      case 'scheduled':
        return 'مجدولة'
      case 'draft':
        return 'مسودة'
      default:
        return status
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            <div className="flex gap-4">
              <Link
                href="/dashboard/pages"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                الصفحات
              </Link>
              <Link
                href="/dashboard/groups"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                المجموعات
              </Link>
              <Link
                href="/dashboard/posts"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                المنشورات
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-gray-900">
              👤 حسابي
            </button>
            <button className="text-gray-700 hover:text-gray-900">
              ⚙️ إعدادات
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-2">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className="text-4xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link
                href="/dashboard/posts/create"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow p-6 transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">✍️</div>
                <h3 className="font-bold">إنشاء منشور</h3>
                <p className="text-sm text-blue-100">نشر محتوى جديد</p>
              </Link>

              <Link
                href="/dashboard/posts/ai-variant"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow p-6 transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">🤖</div>
                <h3 className="font-bold">AI Variant</h3>
                <p className="text-sm text-purple-100">توليد نسخ ذكية</p>
              </Link>

              <Link
                href="/dashboard/posts/schedule"
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow p-6 transition transform hover:scale-105"
              >
                <div className="text-4xl mb-2">⏰</div>
                <h3 className="font-bold">جدولة</h3>
                <p className="text-sm text-green-100">برمجة المنشورات</p>
              </Link>
            </div>

            {/* Recent Posts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">المنشورات الأخيرة</h2>
              </div>
              <div className="overflow-x-auto">
                {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                          المحتوى
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                          المجموعات
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                          التاريخ
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.recentPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                            {post.content.substring(0, 50)}...
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {post.groups.length}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                post.status
                              )}`}
                            >
                              {getStatusLabel(post.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Link
                              href={`/dashboard/posts/${post.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              عرض
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    لا توجد منشورات حتى الآن
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
