import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export default function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // 요청 본문에서 'code'와 'input' 값을 추출
            const { code, input } = req.body;

            if (!code) {
                return res.status(400).json({ error: 'Code is required' });
            }

            // 저장할 파일 경로 설정 (Python 코드)
            const codeFilePath = path.join(process.cwd(), 'public', 'uploads', 'user_code.py');

            // Python 코드를 파일로 저장
            fs.writeFileSync(codeFilePath, code, 'utf8');

            // Python 실행을 위한 spawn 구성
            const pythonProcess = spawn('python', [codeFilePath]);

            // 입력 데이터가 있는 경우 Python stdin으로 전달
            if (input) {
                pythonProcess.stdin.write(input + '\n');
            }
            pythonProcess.stdin.end(); // 입력 스트림 종료

            let output = '';
            let errorOutput = '';

            // Python 실행 결과 받기
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            // Python 실행 중 에러 받기
            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            // Python 프로세스 종료 시 결과 처리
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    res.status(200).json({ output: output.trim() });
                } else {
                    res.status(500).json({ error: errorOutput.trim() });
                }
            });
        } catch (error) {
            // 오류 처리
            res.status(500).json({ error: 'Failed to execute Python code', details: error.message });
        }
    } else {
        // 다른 HTTP 메서드에 대한 오류 처리
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
