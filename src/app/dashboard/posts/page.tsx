'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Card, Button, Alert, LoadingSpinner } from '@/components'

interface Post {
  id: string
  title: string
  content: string
  status: 'draft' | 'scheduled' | 'published'
  createdAt: string
  scheduledAt?: string
  _count?: {
    groups: number
  }
}

type FilterStatus = 'all' | 'published' | 'scheduled' | 'draft'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('فشل جلب المنشورات')
      const data = await response.json()
      setPosts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredPosts = () => {
    if (filterStatus === 'all') return posts
    return posts.filter((post) => post.status === filterStatus)
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      published: 'منشورة',
      scheduled: 'مجدولة',
      draft: 'مسودة',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      published: '✅',
      scheduled: '⏰',
      draft: '📝',
    }
    return icons[status] || '📄'
  }

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('فشل حذف المنشور')

      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const filteredPosts = getFilteredPosts()

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar 
        title="المنشورات" 
        links={[{ href: '/dashboard', label: '← العودة للوحة التحكم' }]}
        actions={
          <Link href="/dashboard/posts/create">
            <Button variant="primary" size="sm">
              + منشور جديد
            </Button>
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            الكل ({posts.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'published'
                ? 'bg-green-600 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✅ منشورة ({posts.filter((p) => p.status === 'published').length})
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⏰ مجدولة ({posts.filter((p) => p.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'draft'
                ? 'bg-gray-600 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 مسودة ({posts.filter((p) => p.status === 'draft').length})
          </button>
        </div>

        {/* Posts Table */}
        {loading ? (
          <LoadingSpinner message="جاري تحميل المنشورات..." />
        ) : (
          <Card title={`المنشورات (${filteredPosts.length})`}>
            <div className="overflow-x-auto">
              {filteredPosts.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        العنوان
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        المحتوى
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        المجموعات
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {post.title || 'بدون عنوان'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                          {post.content || 'بدون محتوى'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              post.status
                            )}`}
                          >
                            {getStatusIcon(post.status)} {getStatusLabel(post.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {post.status === 'scheduled' && post.scheduledAt
                            ? new Date(post.scheduledAt).toLocaleDateString('ar-SA')
                            : new Date(post.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {post._count?.groups || 0} مجموعة
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <Link href={`/dashboard/posts/${post.id}`}>
                              <button className="text-blue-600 hover:underline">
                                عرض
                              </button>
                            </Link>
                            <Link href={`/dashboard/posts/${post.id}/edit`}>
                              <button className="text-gray-600 hover:underline">
                                تعديل
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:underline"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  لا توجد منشورات بهذه الحالة. ابدأ بإنشاء منشور جديد!
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
