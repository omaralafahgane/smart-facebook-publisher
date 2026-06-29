import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { prisma } from '@/lib/prisma'

const FB_APP_ID = process.env.FACEBOOK_APP_ID
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FB_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.json(
        { error: 'رمز التفويض مفقود' },
        { status: 400 }
      )
    }

    // تبديل الرمز بـ Access Token
    const tokenResponse = await axios.get(
      'https://graph.instagram.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: FB_APP_ID,
          client_secret: FB_APP_SECRET,
          redirect_uri: FB_REDIRECT_URI,
          code,
        },
      }
    )

    const { access_token, user_id } = tokenResponse.data

    // الحصول على بيانات المستخدم
    const userResponse = await axios.get(
      `https://graph.instagram.com/v18.0/me`,
      {
        params: {
          fields: 'id,name,email',
          access_token,
        },
      }
    )

    const { id: facebookUserId, name, email } = userResponse.data

    // البحث أو إنشاء حساب Facebook
    let facebookAccount = await prisma.facebookAccount.findUnique({
      where: { userId: facebookUserId },
    })

    if (!facebookAccount) {
      facebookAccount = await prisma.facebookAccount.create({
        data: {
          userId: facebookUserId,
          accessToken: access_token,
        },
      })
    } else {
      // تحديث التوكن
      facebookAccount = await prisma.facebookAccount.update({
        where: { userId: facebookUserId },
        data: { accessToken: access_token },
      })
    }

    // إعادة التوجيه إلى لوحة التحكم
    return NextResponse.redirect(
      new URL(`/dashboard?account=${facebookAccount.id}`, request.url)
    )
  } catch (error: any) {
    console.error('Facebook OAuth Error:', error)
    return NextResponse.json(
      { error: 'فشل التحقق من الهوية' },
      { status: 500 }
    )
  }
}
