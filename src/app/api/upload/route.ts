import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'الملف مفقود' },
        { status: 400 }
      )
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم' },
        { status: 400 }
      )
    }

    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم الملف كبير جداً' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // إنشاء اسم فريد للملف
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    // إنشاء مجلد التحميل إذا لم يكن موجوداً
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // حفظ الملف
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename,
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'فشل تحميل الملف' },
      { status: 500 }
    )
  }
}
