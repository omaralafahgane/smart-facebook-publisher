'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Card, Button, Alert, LoadingSpinner, Modal, Input } from '@/components'

interface Group {
  id: string
  groupName: string
  groupUrl: string
  category: string
  status: string
  createdAt: string
  pageId: string
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageId, setPageId] = useState('')

  const [formData, setFormData] = useState({
    groupName: '',
    groupUrl: '',
    category: 'local',
    pageId: '',
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/groups')
      if (!response.ok) throw new Error('فشل جلب المجموعات')
      const data = await response.json()
      setGroups(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // التحقق من صحة البيانات
      if (!formData.groupName.trim()) {
        throw new Error('اسم المجموعة مطلوب')
      }
      if (!formData.groupUrl.trim()) {
        throw new Error('رابط المجموعة مطلوب')
      }
      if (!formData.pageId.trim()) {
        throw new Error('معرّف الصفحة مطلوب')
      }

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل إضافة المجموعة')
      }

      const newGroup = await response.json()
      setGroups((prev) => [newGroup, ...prev])
      setSuccess('تم إضافة المجموعة بنجاح!')
      setFormData({
        groupName: '',
        groupUrl: '',
        category: 'local',
        pageId: '',
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

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      cameras: '🎥 كاميرات',
      smart_systems: '🏠 أنظمة ذكية',
      local: '📍 محلي',
      offers: '🎁 عروض',
    }
    return labels[category] || category
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'manual_only': return 'bg-yellow-100 text-yellow-800'
      case 'unavailable': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'متاح'
      case 'manual_only': return 'يدوي فقط'
      case 'unavailable': return 'غير متاح'
      default: return status
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar 
        title="إدارة المجموعات" 
        links={[{ href: '/dashboard', label: '← العودة للوحة التحكم' }]}
        actions={
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            + إضافة مجموعة
          </Button>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {loading ? (
          <LoadingSpinner message="جاري تحميل المجموعات..." />
        ) : (
          <Card title="المجموعات المسجلة" subtitle={`إجمالي المجموعات: ${groups.length}`}>
            <div className="overflow-x-auto">
              {groups.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">اسم المجموعة</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">التصنيف</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الإضافة</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {groups.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <a href={group.groupUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {group.groupName || 'مجموعة بدون اسم'}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{getCategoryLabel(group.category)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(group.status)}`}>
                            {getStatusLabel(group.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(group.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:underline">تحرير</button>
                            <button className="text-red-600 hover:underline">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  لا توجد مجموعات مسجلة حالياً. ابدأ بإضافة مجموعتك الأولى!
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Modal لإضافة مجموعة جديدة */}
      <Modal
        isOpen={isModalOpen}
        title="إضافة مجموعة جديدة"
        onClose={() => {
          setIsModalOpen(false)
          setFormData({
            groupName: '',
            groupUrl: '',
            category: 'local',
            pageId: '',
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
              onClick={handleAddGroup}
              loading={isSubmitting}
            >
              إضافة المجموعة
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="اسم المجموعة"
            name="groupName"
            value={formData.groupName}
            onChange={handleInputChange}
            placeholder="مثال: مجموعة الكاميرات"
            required
          />

          <Input
            label="رابط المجموعة"
            name="groupUrl"
            value={formData.groupUrl}
            onChange={handleInputChange}
            placeholder="https://facebook.com/groups/..."
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التصنيف *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="local">📍 محلي</option>
              <option value="cameras">🎥 كاميرات</option>
              <option value="smart_systems">🏠 أنظمة ذكية</option>
              <option value="offers">🎁 عروض</option>
            </select>
          </div>

          <Input
            label="معرّف الصفحة"
            name="pageId"
            value={formData.pageId}
            onChange={handleInputChange}
            placeholder="معرّف الصفحة من قاعدة البيانات"
            required
          />
        </form>
      </Modal>
    </main>
  )
}
