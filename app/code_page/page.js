'use client';

import { useState, useEffect } from 'react';
import styles from './CodePage.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import of Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CodePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = searchParams.get('problemId');
  const title = searchParams.get('title');
  const username = 'a_star';
  const [code, setCode] = useState('# Write your code here\n');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languages = ['Python', 'Java', 'C++', 'JavaScript'];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/code_exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, input }),
    });

    const data = await response.json();

    if (response.ok) {
      setOutput(data.output);
    } else {
      setOutput(`Error: ${data.error}`);
    }
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <Image
            src="/icon.svg"
            alt="Logo"
            width={32}
            height={32}
            className={styles.logoIcon}
          />
        </Link>
        <div className={styles.headerRight}>
          <button
            className={styles.username}
            onClick={() => window.open(`https://www.acmicpc.net/user/${username}`, '_blank')}
          >
            {username}
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            logout
          </button>
          <Image
            src="/sideMenu.svg"
            alt="side menu"
            width={24}
            height={24}
            className={styles.menuIcon}
            onClick={toggleMenu}
          />
        </div>
      </header>

      {/* Side Menu */}
      <div className={`${styles.menuPanel} ${isMenuOpen ? styles.open : ''}`}>
        <button onClick={toggleMenu} className={styles.closeButton}>✖</button>
        <ul>
          <li><Link href="/">여기 뭐 로그인 정보 들어가겠죠?</Link></li>
          <li><a href="https://www.acmicpc.net/" target="_blank" rel="noopener noreferrer">또 뭐 백준돌아가는 링크도?</a></li>
        </ul>
      </div>

      <main className={styles.main}>
        <div className={styles.description}>
          <div className={styles.problemHeader}>
            <h1 className={styles.title}>
              {problemId} <span style={{ fontWeight: 'normal' }}> - {title}</span>
            </h1>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={styles.blueButton}
                onClick={handleSubmit}
              >
                실행하기
              </button>
              <button
                type="button"
                className={styles.blueButton}
              >
                예제 테스트
              </button>
              <button
                type="button"
                className={styles.outlineButton}
              >
                백준 제출하기
              </button>
              <div className={styles.languageDropdown}>
                <button
                  className={styles.blueButton}
                  onClick={toggleLanguageDropdown}
                >
                  {selectedLanguage} ▼
                </button>
                {isLanguageDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    {languages.map((lang) => (
                      <li
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        {lang}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.codeSection}>
              <div className={styles.monacoContainer}>
                <MonacoEditor
                  height="500px"
                  defaultLanguage="python"
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
            <div className={styles.ioContainer}>
              <div className={styles.inputSection}>
                <h4>Input:</h4>
                <div className={styles.monacoContainer}>
                  <MonacoEditor
                    height="100px"
                    defaultLanguage="plaintext"
                    value={input}
                    onChange={(value) => setInput(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      automaticLayout: true,
                      readOnly: false
                    }}
                  />
                </div>
              </div>
              <div className={styles.outputSection}>
                <h4>Output:</h4>
                <div className={styles.monacoContainer}>
                  <MonacoEditor
                    height="100px"
                    defaultLanguage="plaintext"
                    value={output}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      automaticLayout: true,
                      readOnly: true  // Make output read-only
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.blueButton}>실행하기</button>
              <button type="button" className={styles.outlineButton}>백준 제출하기</button>
            </div>
          </form>
        </div>

        <div className={styles.chatSection}>
          <ChatPage />
        </div>
      </main>
    </div>
  );
}

// ChatPage component
function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.message };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
      backgroundColor: 'transparent'
    }}>

      <div style={{
        height: '500px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        overflowY: 'scroll',
        marginBottom: '10px',
        backgroundColor: 'white'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.role === 'user' ? '#d1f7c4' : '#f1f1f1',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && <p>Loading...</p>}
      </div>
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            width: '100px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
