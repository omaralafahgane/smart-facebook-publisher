'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AIVariantPage() {
  const [originalContent, setOriginalContent] = useState('')
  const [tone, setTone] = useState('promotional')
  const [variants, setVariants] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [hashtags, setHashtags] = useState<string[]>([])

  const tones = [
    { value: 'professional', label: '👔 احترافي' },
    { value: 'casual', label: '😊 ودي' },
    { value: 'promotional', label: '🎁 ترويجي' },
  ]

  const handleGenerateVariants = async () => {
    if (!originalContent.trim()) {
      alert('الرجاء إدخال محتوى أولاً')
      return
    }

    setLoading(true)
    try {
      // API call would go here
      // const response = await fetch('/api/ai/variants', {
      //   method: 'POST',
      //   body: JSON.stringify({ content: originalContent, tone }),
      // })
      // const data = await response.json()

      // Mock data for demo
      const mockVariants = [
        `${originalContent}\n\n✨ نسخة احترافية مع تنسيق أفضل`,
        `هل تعرف؟ ${originalContent}\n\n🎯 تحسين الوصول والتفاعل`,
        `⭐ عرض خاص: ${originalContent}\n\n💫 صيغة ترويجية فعالة`,
      ]

      const mockHashtags = [
        'عروض',
        'تسوق',
        'خصم',
        'جديد',
        'حصري',
        'محدود',
      ]

      setVariants(mockVariants)
      setHashtags(mockHashtags)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyVariant = (variant: string) => {
    navigator.clipboard.writeText(variant)
    alert('تم نسخ النص!')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← العودة
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">مولد النسخ الذكية</h1>
          <div></div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-4 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900">الإعدادات</h3>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  أسلوب الكتابة
                </label>
                <div className="space-y-2">
                  {tones.map((t) => (
                    <label key={t.value} className="flex items-center">
                      <input
                        type="radio"
                        value={t.value}
                        checked={tone === t.value}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="mr-3 text-gray-700">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Original Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  المحتوى الأصلي
                </label>
                <textarea
                  value={originalContent}
                  onChange={(e) => setOriginalContent(e.target.value)}
                  placeholder="الصق المحتوى الذي تريد تحسينه..."
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateVariants}
                disabled={loading || !originalContent.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {loading ? '⏳ جاري التحليل...' : '🤖 توليد نسخ ذكية'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            {variants.length > 0 ? (
              <div className="space-y-4">
                {/* Variants */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    النسخ المقترحة
                  </h3>
                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow p-4"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-sm text-gray-800 flex-1 whitespace-pre-wrap break-words">
                            {variant}
                          </p>
                          <button
                            onClick={() => handleCopyVariant(variant)}
                            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            نسخ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      الهاشتاغات المقترحة
                    </h3>
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              navigator.clipboard.writeText(`#${tag}`)
                            }
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-gray-600">
                  أدخل المحتوى الأصلي واختر الأسلوب المناسب لتوليد نسخ ذكية
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
