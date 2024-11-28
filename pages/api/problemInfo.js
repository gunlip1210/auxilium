// pages/api/python.js
import { exec } from 'child_process';

export default function handler(req, res) {
    // 1. child-process모듈의 spawn 취득
    const spawn = require('child_process').spawn;

    // 2. spawn을 통해 "python 파이썬파일.py" 명령어 실행
    // const result = spawn('python', ['lib/test.py', 'submit', '1000', 'lib/code.py']);
    const result = spawn('python', ['lib/problemInfo.py', 1017]);


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
}
