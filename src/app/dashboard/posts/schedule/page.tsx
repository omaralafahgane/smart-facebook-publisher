'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      content: 'عرض خاص على الكاميرات',
      scheduledTime: '2024-01-18 14:30',
      groups: ['مجموعة الكاميرات'],
      status: 'pending',
    },
    {
      id: 2,
      content: 'تحديث أنظمة الأمان الجديدة',
      scheduledTime: '2024-01-19 10:00',
      groups: ['الأنظمة الذكية'],
      status: 'pending',
    },
    {
      id: 3,
      content: 'عرض محلي حصري',
      scheduledTime: '2024-01-20 16:45',
      groups: ['العروض المحلية', 'عروض خاصة'],
      status: 'scheduled',
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    scheduledTime: '',
    selectedGroups: [] as string[],
  })

  const groups = [
    { id: '1', name: 'مجموعة الكاميرات' },
    { id: '2', name: 'الأنظمة الذكية' },
    { id: '3', name: 'العروض المحلية' },
    { id: '4', name: 'عروض خاصة' },
  ]

  const handleAddSchedule = () => {
    if (
      formData.content &&
      formData.scheduledTime &&
      formData.selectedGroups.length > 0
    ) {
      const newSchedule = {
        id: schedule.length + 1,
        content: formData.content,
        scheduledTime: formData.scheduledTime,
        groups: formData.selectedGroups.map(
          (id) => groups.find((g) => g.id === id)?.name || ''
        ),
        status: 'pending' as const,
      }
      setSchedule([...schedule, newSchedule])
      setFormData({ content: '', scheduledTime: '', selectedGroups: [] })
      setShowForm(false)
      alert('تم جدولة المنشور بنجاح!')
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
          <h1 className="text-2xl font-bold text-gray-900">جدولة المنشورات</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + جدولة جديدة
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              جدولة منشور جديد
            </h3>
            <div className="space-y-4">
              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  المحتوى
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="أدخل محتوى المنشور..."
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date/Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  التاريخ والوقت
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

              {/* Groups */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  المجموعات
                </label>
                <div className="space-y-2">
                  {groups.map((group) => (
                    <label key={group.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.selectedGroups.includes(group.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedGroups: [
                                ...formData.selectedGroups,
                                group.id,
                              ],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              selectedGroups: formData.selectedGroups.filter(
                                (id) => id !== group.id
                              ),
                            })
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="mr-3 text-gray-700">{group.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  جدولة
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    المحتوى
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    التاريخ والوقت
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    المجموعات
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schedule.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                      {item.content}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.scheduledTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.groups.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        قيد الانتظار
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:underline">
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
