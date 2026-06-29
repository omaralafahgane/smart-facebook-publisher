import axios from 'axios'
import { decryptToken } from './auth'

const FB_GRAPH_VERSION = 'v18.0'
const FB_GRAPH_URL = `https://graph.facebook.com/${FB_GRAPH_VERSION}`

export async function getPageDetails(pageId: string, accessToken: string) {
  try {
    const decrypted = decryptToken(accessToken)
    const response = await axios.get(`${FB_GRAPH_URL}/${pageId}`, {
      params: {
        fields: 'id,name,picture,access_token',
        access_token: decrypted,
      },
    })
    return response.data
  } catch (error) {
    console.error('Facebook API Error:', error)
    throw error
  }
}

export async function publishPost(
  pageId: string,
  accessToken: string,
  content: string,
  imageUrl?: string
) {
  try {
    const decrypted = decryptToken(accessToken)
    const payload: any = {
      message: content,
      access_token: decrypted,
    }

    if (imageUrl) {
      payload.url = imageUrl
    }

    const response = await axios.post(`${FB_GRAPH_URL}/${pageId}/feed`, payload)
    return response.data
  } catch (error) {
    console.error('Facebook Publish Error:', error)
    throw error
  }
}

export async function getUserPages(accessToken: string) {
  try {
    const decrypted = decryptToken(accessToken)
    const response = await axios.get(`${FB_GRAPH_URL}/me/accounts`, {
      params: {
        fields: 'id,name,access_token,picture',
        access_token: decrypted,
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Facebook API Error:', error)
    throw error
  }
}

export async function getUserGroups(accessToken: string) {
  try {
    const decrypted = decryptToken(accessToken)
    const response = await axios.get(`${FB_GRAPH_URL}/me/groups`, {
      params: {
        fields: 'id,name,privacy,icon',
        access_token: decrypted,
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Facebook API Error:', error)
    throw error
  }
}

export async function publishToGroup(
  groupId: string,
  accessToken: string,
  content: string,
  imageUrl?: string
) {
  try {
    const decrypted = decryptToken(accessToken)
    const payload: any = {
      message: content,
      access_token: decrypted,
    }

    if (imageUrl) {
      payload.url = imageUrl
    }

    const response = await axios.post(
      `${FB_GRAPH_URL}/${groupId}/feed`,
      payload
    )
    return response.data
  } catch (error) {
    console.error('Facebook Publish Error:', error)
    throw error
  }
}

export async function getGroupInfo(groupId: string, accessToken: string) {
  try {
    const decrypted = decryptToken(accessToken)
    const response = await axios.get(`${FB_GRAPH_URL}/${groupId}`, {
      params: {
        fields: 'id,name,privacy,updated_time',
        access_token: decrypted,
      },
    })
    return response.data
  } catch (error) {
    console.error('Facebook API Error:', error)
    throw error
  }
}
