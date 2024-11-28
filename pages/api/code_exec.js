import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default function handler(req, res) {
    if (req.method === 'POST') {
        try {
        // 요청 본문에서 'code' 값을 추출
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        // 저장할 파일 경로 설정
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'user_code.py');

        // 'code' 값을 파일에 저장
        fs.writeFileSync(filePath, code, 'utf8');

        // 성공적인 응답 반환
        // res.status(200).json({ message: 'File saved successfully' });
        } catch (error) {
        // 오류 처리
        res.status(500).json({ error: 'Failed to save the file', details: error.message });
        }
    } else {
        // 다른 HTTP 메서드에 대한 오류 처리
        res.status(405).json({ error: 'Method Not Allowed' });
    }
    // 1. child-process모듈의 spawn 취득
    const spawn = require('child_process').spawn;

    // 2. spawn을 통해 "python 파이썬파일.py" 명령어 실행
    const result = spawn('python', ['public/uploads/user_code.py']);

    // 3. stdout의 'data'이벤트리스너로 실행결과를 받는다.
    result.stdout.on('data', function(data) {
        console.log(data.toString());
        res.status(200).json({output: data.toString()});
    });

    // 4. 에러 발생 시, stderr의 'data'이벤트리스너로 실행결과를 받는다.
    result.stderr.on('data', function(data) {
        console.log(data.toString());
        res.status(500).json({ error:  data.toString()});
    });
}
