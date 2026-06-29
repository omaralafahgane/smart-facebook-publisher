'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePostPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    content: '',
    imageUrl: '',
    videoUrl: '',
    selectedGroups: [] as string[],
    scheduledTime: '',
    pageId: '',
  })

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const groups = [
    { id: '1', name: 'مجموعة الكاميرات' },
    { id: '2', name: 'الأنظمة الذكية' },
    { id: '3', name: 'العروض المحلية' },
    { id: '4', name: 'العروض الخاصة' },
  ]

  const handleGroupToggle = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter((id) => id !== groupId)
        : [...prev.selectedGroups, groupId],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error('فشل تحميل الصورة')
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
      }))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content,
          imageUrl: formData.imageUrl,
          videoUrl: formData.videoUrl,
          pageId: formData.pageId,
          groupIds: formData.selectedGroups,
        }),
      })

      if (!response.ok) {
        throw new Error('فشل إنشاء المنشور')
      }

      const data = await response.json()
      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/posts/${data.id}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← العودة
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء منشور جديد</h1>
          <div></div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  محتوى المنشور
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value })
                    setPreview(e.target.value)
                  }}
                  placeholder="اكتب محتوى المنشور هنا..."
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length} / 5000
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  صورة المنشور (اختياري)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-input"
                  />
                  <label
                    htmlFor="image-input"
                    className="cursor-pointer text-blue-600 hover:text-blue-700"
                  >
                    📸 انقر لتحميل صورة
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  رابط الفيديو (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Groups */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  اختر المجموعات
                </label>
                <div className="space-y-2">
                  {groups.map((group) => (
                    <label key={group.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.selectedGroups.includes(group.id)}
                        onChange={() => handleGroupToggle(group.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="mr-3 text-gray-700">{group.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  جدولة النشر (اختياري)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Page ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  معرّف الصفحة *
                </label>
                <input
                  type="text"
                  value={formData.pageId}
                  onChange={(e) =>
                    setFormData({ ...formData, pageId: e.target.value })
                  }
                  placeholder="معرّف الصفحة"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  ✅ تم إنشاء المنشور بنجاح!
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading || !formData.content || !formData.pageId}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ المنشور'}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg transition text-center"
                >
                  إلغاء
                </Link>
              </div>
            </div>
          </form>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">معاينة</h3>

              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed">
                <div className="text-center mb-4">
                  <span className="text-4xl">👁️</span>
                </div>

                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}

                {preview && (
                  <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {preview}
                  </p>
                )}

                {!preview && !formData.imageUrl && (
                  <p className="text-gray-500 text-sm text-center">
                    ابدأ بكتابة المحتوى للمعاينة
                  </p>
                )}

                {formData.selectedGroups.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-600 mb-2">سيتم نشره في:</p>
                    <div className="space-y-1">
                      {formData.selectedGroups.map((groupId) => {
                        const group = groups.find((g) => g.id === groupId)
                        return (
                          <p key={groupId} className="text-xs text-blue-600">
                            ✓ {group?.name}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
