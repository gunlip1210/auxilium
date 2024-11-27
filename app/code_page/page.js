'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '../styles/globals.css';

export default function CodePage() {
  const searchParams = useSearchParams();
  const problemId = searchParams.get('id');

  // 문제 정보를 저장할 state
  const [problemInfo, setProblemInfo] = useState(null);

  useEffect(() => {
    // 여기서 problemId를 사용하여 해당 문제의 정보를 가져올 수 있습니다
    // 예시로 하드코딩된 데이터를 사용
    const problems = {
      1569: {
        title: '[토마토]',
        description: '★ 35.59%의 정답 비율',
        difficulty: 'Gold',
        category: 'BFS'
      },
      1339: {
        title: '[단어수학]',
        description: '★ c++ 추천 문제',
        difficulty: 'Gold',
        category: 'Greedy'
      },
      // ... 다른 문제들 추가
    };

    setProblemInfo(problems[problemId] || null);
  }, [problemId]);

  return (
    <div className="container">
      {/* Header */}
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

      {/* Main Content */}
      <div className="code-page-container">
        <h1 className="code-page-title">문제 {problemId}</h1>
        {problemInfo ? (
          <div className="problem-info">
            <h2>{problemInfo.title}</h2>
            <p className="difficulty">난이도: {problemInfo.difficulty}</p>
            <p className="category">분류: {problemInfo.category}</p>
            <p className="description">{problemInfo.description}</p>

            {/* 코드 에디터나 다른 컴포넌트들을 여기에 추가할 수 있습니다 */}
          </div>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
    </div>
  );
}
