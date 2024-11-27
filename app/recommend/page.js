// pages/index.js

'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.error);
      }
    } catch (error) {
      setAnswer('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>OpenAI 질문</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요"
        />
        <button type="submit" disabled={loading}>질문하기</button>
      </form>
      {loading && <p>응답을 기다리는 중...</p>}
      {answer && <p>응답: {answer}</p>}
    </div>
  );
}
