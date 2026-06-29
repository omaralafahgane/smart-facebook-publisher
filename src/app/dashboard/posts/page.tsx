'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PostsPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'عرض خاص على الكاميرات',
      content: 'احصل على أفضل الكاميرات بأسعار حصرية...',
      status: 'published',
      date: '2024-01-15',
      groups: 3,
    },
    {
      id: 2,
      title: 'تحديث أنظمة الأمان',
      content: 'تحديثات جديدة لأنظمة الأمان الذكية...',
      status: 'scheduled',
      date: '2024-01-18',
      groups: 2,
    },
    {
      id: 3,
      title: 'عرض محلي جديد',
      content: 'عرض حصري للمجتمع المحلي...',
      status: 'draft',
      date: '2024-01-20',
      groups: 1,
    },
  ])

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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">المنشورات</h1>
          <Link
            href="/dashboard/posts/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + منشور جديد
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            الكل
          </button>
          <button className="px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
            ✅ منشورة
          </button>
          <button className="px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
            ⏰ مجدولة
          </button>
          <button className="px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
            📝 مسودة
          </button>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
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
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      {post.content}
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
                      {post.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.groups} مجموعة
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:underline">
                          عرض
                        </button>
                        <button className="text-gray-600 hover:underline">
                          تعديل
                        </button>
                        <button className="text-red-600 hover:underline">
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
