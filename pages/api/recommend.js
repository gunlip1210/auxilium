// 사용자가 프롬프트를 입력 할 경우 그 프롬프트에 맞춰서 문제를 추천해주고, 사용자가 아무것도 입력하지 않으면 최근에 푼 5문제와 유사한 문제를 추천.

import { OpenAI } from 'openai';
import { exec } from 'child_process';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let { question } = req.body;

        // question이 비어있다면 'empty'를 대신 저장해줘.
        if (!question || question.trim() === '') {
            question = '골드~플래티넘 난이도의 DFS 문제 추천해줘. 1017번 소수 쌍 문제도 같이 추천해줘.';
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,  // 환경변수로 API 키 불러오기
        });

        let flag = true;
        while(flag){
            try {
                // OpenAI API에 질문 보내기
                const response = await openai.chat.completions.create({
                    model: 'gpt-4o',  // 사용할 모델
                    messages: [
                        { role: 'system', content: '너는 백준(온라인 알고리즘 문제 풀이 사이트)에서 사용자에게 적절한 문제를 찾아서 추천해주는 선생님이야. 답변은 항상 json 형식으로 해줘. 경어체를 사용해줘. 짧은 설명은 15자 내외, 추천하는 이유는 길게 써도 괜찮아.\
                            example -> {"problem_info": [{"num": <백준 문제 번호1>, "des": "<문제에 대한 짧은 설명1>", "res": "<추천하는 이유1>"}, ..., {"num": <백준 문제 번호5>, "des": "<문제에 대한 짧은 설명5>", "res": "<추천하는 이유5>"}]}' },
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
                // console.log(response.choices[0].message)
                const json_output = JSON.stringify(JSON.parse(response.choices[0].message.content));
                // res.status(200).json(json_output);

                // 1. child-process모듈의 spawn 취득
                const spawn = require('child_process').spawn;

                // 2. spawn을 통해 "python 파이썬파일.py" 명령어 실행
                // const result = spawn('python', ['lib/test.py', 'submit', '1000', 'lib/code.py']);
                const result = spawn('python', ['lib/recommend.py', json_output]);


                // 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
                result.stdout.on('data', function(data) {
                    console.log(data.toString());
                    res.status(200).json({ output: data.toString() });
                });

                // 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
                result.stderr.on('data', function(data) {
                    console.log(data.toString());
                    res.status(500).json({ error: 'python 실행 중 오류가 발생했습니다.' });
                });

                
                flag = false;
            } catch (error) {
                console.log(error)
            }
        }
    } else {
        res.status(405).json({ error: '메서드가 허용되지 않습니다.' });
    }
}
