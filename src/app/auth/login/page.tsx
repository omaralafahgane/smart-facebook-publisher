'use client'

import Link from 'next/link'
import { generateMetaAuthUrl } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [authUrl, setAuthUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAuthUrl(generateMetaAuthUrl())
  }, [])

  const handleMetaLogin = () => {
    if (authUrl) {
      window.location.href = authUrl
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-white mb-2">Smart Facebook Publisher</h1>
          <p className="text-blue-100">منصة ذكية لنشر المحتوى على فيسبوك</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">تسجيل الدخول</h2>

          {/* Meta Login Button */}
          <button
            onClick={handleMetaLogin}
            disabled={loading || !authUrl}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 mb-4"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                جاري التوجيه...
              </>
            ) : (
              <>
                <span>f</span>
                تسجيل الدخول عبر Meta
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Demo Login */}
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-4 rounded-lg transition"
            onClick={() => {
              window.location.href = '/dashboard'
            }}
          >
            🧪 دخول تجريبي
          </button>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">المميزات:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ إدارة الصفحات والمجموعات</li>
              <li>✅ إنشاء ونشر المنشورات</li>
              <li>✅ توليد نسخ ذكية بـ AI</li>
              <li>✅ جدولة المنشورات</li>
            </ul>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            بالدخول، أنت توافق على{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              شروط الاستخدام
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
