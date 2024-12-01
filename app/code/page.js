// app/code.js

'use client';

import { useState } from 'react';

export default function Page() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 요청 본문에 id와 password 포함
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, password }), // id와 password를 JSON 형식으로 보내기
        });

        const data = await response.json(); // 서버 응답 받기

        if (response.ok) {
            setMessage(`${data.CookieValue}`);
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        ID:
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)} // 사용자 입력을 상태에 저장
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // 사용자 입력을 상태에 저장
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
