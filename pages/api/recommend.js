// 사용자가 프롬프트를 입력 할 경우 그 프롬프트에 맞춰서 문제를 추천해주고, 사용자가 아무것도 입력하지 않으면 최근에 푼 5문제와 유사한 문제를 추천.

import { OpenAI } from 'openai';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let { question } = req.body;

        // question이 비어있다면 'empty'를 대신 저장해줘.
        if (!question || question.trim() === '') {
            question = 'empty';
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,  // 환경변수로 API 키 불러오기
        });

        try {
            // OpenAI API에 질문 보내기
            const response = await openai.chat.completions.create({
                model: 'gpt-4',  // 사용할 모델 (gpt-4o는 잘못된 모델 이름, gpt-4로 수정)
                messages: [
                    { role: 'system', content: '너는 백준(온라인 알고리즘 문제 풀이 사이트)에서 사용자에게 적절한 문제를 찾아서 추천해주는 선생님이야. 답변은 항상 json 형식으로 해줘.\
                        example: {"<백준 문제 번호1>" : "<추천하는 이유>", ..., "<백준 문제 번호5>" : "<추천하는 이유>"}' },
                    { role: 'user', content: question }
                ],
                // temperature: 0.7,
                // max_tokens: 150,
                // top_p: 0.9,
                // frequency_penalty: 0.5,
                // presence_penalty: 0.5,
                // stop: ['\n', 'The End'],
                // user: 'user1234'
            });

            // OpenAI의 응답을 클라이언트로 전달
            res.status(200).json({ answer: response.choices[0].message.content });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'OpenAI API 요청 중 오류가 발생했습니다.' });
        }
    } else {
        res.status(405).json({ error: '메서드가 허용되지 않습니다.' });
    }
}
