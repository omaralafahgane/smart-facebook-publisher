import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAIVariant(content: string, tone: string = 'promotional'): Promise<string> {
  try {
    const message = await openai.messages.create({
      model: 'gpt-4-turbo-preview',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `أعد كتابة الإعلان التالي بأسلوب ${tone}:\n\n${content}`,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  } catch (error) {
    console.error('OpenAI Error:', error)
    throw error
  }
}

export async function generateHashtags(content: string): Promise<string[]> {
  try {
    const message = await openai.messages.create({
      model: 'gpt-4-turbo-preview',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `اقترح 5-10 هاشتاغات ذات صلة للإعلان التالي:\n\n${content}\n\nأرجع النتيجة كقائمة مفصولة بفواصل`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return text.split(',').map((tag) => tag.trim().replace('#', ''))
  } catch (error) {
    console.error('OpenAI Error:', error)
    throw error
  }
}
