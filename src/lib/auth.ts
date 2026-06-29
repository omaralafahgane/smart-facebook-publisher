import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
}

export function decryptToken(encryptedToken: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function generateMetaAuthUrl(): string {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI
  const scope = 'pages_manage_posts,pages_read_user_content,pages_manage_metadata'
  
  const params = new URLSearchParams({
    client_id: appId || '',
    redirect_uri: redirectUri || 'http://localhost:3000/api/auth/callback/meta',
    scope,
    state: generateRandomState(),
    response_type: 'code',
  })
  
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
}

export function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * التحقق من صحة رمز الحالة
 */
export function validateStateToken(state: string, storedState: string): boolean {
  return state === storedState
}

/**
 * إنشاء معرّف فريد
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
