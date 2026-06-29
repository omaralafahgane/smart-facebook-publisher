import { Queue, Worker } from 'bullmq'
import { getRedisClient } from './redis'
import { prisma } from './prisma'
import { publishPost } from './facebook'

let publishQueue: Queue | null = null

export async function getPublishQueue() {
  if (!publishQueue) {
    const redis = await getRedisClient()
    publishQueue = new Queue('publish', { connection: redis as any })
  }
  return publishQueue
}

export async function addPublishJob(postId: string, delay?: number) {
  const queue = await getPublishQueue()
  await queue.add(
    'publish-post',
    { postId },
    {
      delay,
      removeOnComplete: true,
      removeOnFail: false,
    }
  )
}

export async function setupPublishWorker() {
  const redis = await getRedisClient()
  
  new Worker('publish', async (job) => {
    const { postId } = job.data
    
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          page: true,
          publishLogs: true,
        },
      })

      if (!post || !post.page) {
        throw new Error('Post or Page not found')
      }

      const result = await publishPost(post.page.facebookPageId, post.page.accessToken, post.content, post.imageUrl || undefined)

      await prisma.publishLog.create({
        data: {
          postId,
          pageId: post.pageId,
          status: 'success',
          facebookPostId: result.id,
          publishedAt: new Date(),
        },
      })

      await prisma.post.update({
        where: { id: postId },
        data: { status: 'published' },
      })
    } catch (error: any) {
      await prisma.publishLog.create({
        data: {
          postId,
          pageId: post?.pageId || '',
          status: 'failed',
          errorMessage: error.message,
        },
      })

      throw error
    }
  }, { connection: redis as any })
}
