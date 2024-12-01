'use client';

import { useState } from 'react';
import '../styles/globals.css';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful - redirect to main page
                router.push('/');
            } else {
                // Login failed
                setError(data.error);
            }
        } catch (err) {
            setError('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="container">
            {/* 헤더 */}
            <header className="header">
                <a href="/">
                    <img src="/icon.svg" alt="Logo" className="logo-icon" />
                </a>
                <div className="side-menu">
                    <img
                        src="/sideMenu.svg"
                        alt="side menu"
                        className="menu-icon"
                    />
                </div>
            </header>

            {/* 로그인 폼 */}
            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <h1 className="login-title">백준 로그인</h1>
                    {error && <div className="error-message">{error}</div>}
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                    <div className="login-footer">
                        <a href="#" className="forgot-password">비밀번호 찾기</a>
                        <a href="#" className="sign-up">회원가입</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
