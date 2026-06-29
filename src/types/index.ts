// Facebook Types
export interface FacebookPage {
  id: string
  name: string
  access_token: string
  picture?: {
    data?: {
      height: number
      width: number
      is_silhouette: boolean
      url: string
    }
  }
}

export interface FacebookGroup {
  id: string
  name: string
  privacy: string
}

// Post Types
export interface CreatePostRequest {
  content: string
  imageUrl?: string
  videoUrl?: string
  groupIds?: string[]
  scheduledTime?: Date
  campaignId?: string
}

export interface PostResponse {
  id: string
  content: string
  imageUrl?: string
  videoUrl?: string
  status: string
  createdAt: Date
}

// Schedule Types
export interface ScheduleRequest {
  type: 'now' | 'after_hour' | 'daily' | 'custom'
  scheduledTime: Date
  recurrenceRule?: string
}

// AI Types
export interface AIVariantRequest {
  originalContent: string
  tone?: 'professional' | 'casual' | 'promotional'
}

export interface AIVariantResponse {
  variant: string
  hashtags: string[]
  title?: string
}

// Meta OAuth Types
export interface MetaOAuthConfig {
  appId: string
  appSecret: string
  redirectUri: string
}

export interface MetaAuthResponse {
  access_token: string
  token_type: string
  expires_in?: number
}
