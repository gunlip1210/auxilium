import { OpenAIApi } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  // 환경변수로 API 키 불러오기
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages,
    });

    const message = response.data.choices[0]?.message?.content || 'No response';
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
}
