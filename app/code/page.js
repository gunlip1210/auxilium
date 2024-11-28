// app/code.js

'use client';

import { useState } from 'react';

export default function Page() {
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 요청 본문에 id와 password 포함
        const response = await fetch('/api/code_exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, input }), // id와 password를 JSON 형식으로 보내기
        });

        const data = await response.json(); // 서버 응답 받기

        if (response.ok) {
            setOutput(data.output);
        } else {
            setOutput(`Error: ${data.error}`);
        }
    };

    return (
        <div>
            <h1>Code execute</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                    <h2>Code:</h2>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)} // 사용자 입력을 상태에 저장
                            rows={30} // 텍스트 영역 높이 설정 (필요에 따라 조정)
                            cols={200} // 텍스트 영역 너비 설정 (필요에 따라 조정)
                        />
                    </label>
                </div>
                <div>
                    <label>
                    <h2>Input:</h2>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)} // 사용자 입력을 상태에 저장
                            rows={10} // 텍스트 영역 높이 설정 (필요에 따라 조정)
                            cols={200} // 텍스트 영역 너비 설정 (필요에 따라 조정)
                        />
                    </label>
                </div>
                <button type="submit">실행</button>
            </form>
            <div>
                <h2>Output:</h2>
                <pre>{output}</pre> {/* <pre> 태그로 줄 바꿈과 공백을 그대로 출력 */}
            </div>
        </div>
    );
}
