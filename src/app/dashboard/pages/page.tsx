'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Card, Button, Alert, LoadingSpinner, Modal, Input } from '@/components'

interface Page {
  id: string
  pageName: string
  pageUrl: string
  facebookPageId: string
  createdAt: string
  _count?: {
    groups: number
    posts: number
  }
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    pageName: '',
    pageUrl: '',
    facebookPageId: '',
    accessToken: '',
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pages')
      if (!response.ok) throw new Error('فشل جلب الصفحات')
      const data = await response.json()
      setPages(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // التحقق من صحة البيانات
      if (!formData.pageName.trim()) {
        throw new Error('اسم الصفحة مطلوب')
      }
      if (!formData.pageUrl.trim()) {
        throw new Error('رابط الصفحة مطلوب')
      }
      if (!formData.facebookPageId.trim()) {
        throw new Error('معرّف صفحة فيسبوك مطلوب')
      }
      if (!formData.accessToken.trim()) {
        throw new Error('توكن الوصول مطلوب')
      }

      // للتطوير: نحتاج لمعرّف حساب فيسبوك. سنستخدم قيمة افتراضية
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageName: formData.pageName,
          pageUrl: formData.pageUrl,
          facebookPageId: formData.facebookPageId,
          accessToken: formData.accessToken,
          facebookAccountId: 'temp-account-id', // سيتم استبداله بـ ID حقيقي من Meta OAuth
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل إضافة الصفحة')
      }

      const newPage = await response.json()
      setPages((prev) => [newPage, ...prev])
      setSuccess('تم إضافة الصفحة بنجاح!')
      setFormData({
        pageName: '',
        pageUrl: '',
        facebookPageId: '',
        accessToken: '',
      })
      setIsModalOpen(false)

      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar 
        title="إدارة الصفحات" 
        links={[{ href: '/dashboard', label: '← العودة للوحة التحكم' }]}
        actions={
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            + إضافة صفحة
          </Button>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {loading ? (
          <LoadingSpinner message="جاري تحميل الصفحات..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.length > 0 ? (
              pages.map((page) => (
                <Card 
                  key={page.id} 
                  title={page.pageName}
                  className="hover:shadow-lg transition"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        نشط
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {page.facebookPageId}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      <a href={page.pageUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {page.pageUrl}
                      </a>
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs text-gray-600">المجموعات</p>
                        <p className="text-xl font-bold text-gray-900">
                          {page._count?.groups || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs text-gray-600">المنشورات</p>
                        <p className="text-xl font-bold text-gray-900">
                          {page._count?.posts || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" className="flex-1">
                        التحكم
                      </Button>
                      <Link href={`/dashboard/groups?pageId=${page.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          المجموعات
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow text-gray-500">
                لا توجد صفحات مسجلة حالياً. قم بإضافة صفحة جديدة للبدء.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal لإضافة صفحة جديدة */}
      <Modal
        isOpen={isModalOpen}
        title="إضافة صفحة جديدة"
        onClose={() => {
          setIsModalOpen(false)
          setFormData({
            pageName: '',
            pageUrl: '',
            facebookPageId: '',
            accessToken: '',
          })
          setError(null)
        }}
        size="md"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddPage}
              loading={isSubmitting}
            >
              إضافة الصفحة
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="اسم الصفحة"
            name="pageName"
            value={formData.pageName}
            onChange={handleInputChange}
            placeholder="مثال: صفحة الكاميرات"
            required
          />

          <Input
            label="رابط الصفحة"
            name="pageUrl"
            value={formData.pageUrl}
            onChange={handleInputChange}
            placeholder="https://facebook.com/..."
            required
          />

          <Input
            label="معرّف صفحة فيسبوك"
            name="facebookPageId"
            value={formData.facebookPageId}
            onChange={handleInputChange}
            placeholder="معرّف الصفحة من فيسبوك"
            required
          />

          <Input
            label="توكن الوصول"
            name="accessToken"
            type="password"
            value={formData.accessToken}
            onChange={handleInputChange}
            placeholder="توكن الوصول من Meta"
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>ملاحظة:</strong> يمكنك الحصول على هذه البيانات من تطبيق Meta الخاص بك أو من خلال تسجيل الدخول عبر Meta OAuth.
            </p>
          </div>
        </form>
      </Modal>
    </main>
  )
}
