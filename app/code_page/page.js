'use client';

import { useState, useEffect } from 'react';
import styles from './CodePage.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';

// Dynamic import of Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
let count = 0;
const COUNT = 1;

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
  const [selectedLanguage, setSelectedLanguage] = useState('C++');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmitExample = async (e) => {
    const corretOutput = '806 926';
    e.preventDefault();
    setInput('20\n941 902 873 841 948 851 945 854 815 898 806 826 976 878 861 919 926 901 875 864\n')
    const response = await fetch('/api/code_exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, input }),
    });

    const data = await response.json();

    console.log(typeof data.output);

    if (response.ok) {
      if (corretOutput === data.output.trim()) {
        setOutput(data.output + `\n\n맞췄습니다!`);
        alert('맞췄습니다!');
      } else {
        setOutput(data.output + `\n\n틀렸습니다`);
        alert('틀렸습니다');
      }
    } else {
      setOutput(`Error: ${data.error}`);
    }
  };

  const handleSubmitBOJ = async (e) => {
    count += 1;
    alert('백준에 제출 되었습니다.');
    setTimeout(() => {
      if (count > COUNT) {
        alert('성공');
      } else {
        alert('실패');
      }
    }, 2000); // 2000ms = 2초
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const systemMessage = { role: 'system', content: "1. 역할: 너는 사용자의 알고리즘 문제 풀이를 도와주는 챗봇이야. 2. 문제 정보는 제일 마지막에 json 형식으로 넣어뒀어. 3. 너는 사용자에게 절대 정답 코드를 알려줄 수 없어. 4. 사용자의 코드를 응답에 언급한다면, 몇 번째 줄인지 꼭 같이 말해줘. 5. 사용자는 알고리즘 문제를 풀며 프로그래밍을 학습 중인 사람이야. 너가 그 사람의 코드 학습을 도와주어야해. 6. Think step by step. 7. 언어는 Python. 8. 문제 정보: {'numberOfProblem': 1017, 'nameOfProblem': '소수 쌍', 'descriptionOfProblem': '\n지민이는 수의 리스트가 있을 때, 이를 짝지어 각 쌍의 합이 소수가 되게 하려고 한다. 예를 들어, {1, 4, 7, 10, 11, 12}가 있다고 하자. 지민이는 다음과 같이 짝지을 수 있다.\n1 + 4 = 5,\xa07 + 10 = 17,\xa011 + 12 = 23\n또는\n1 + 10 = 11,\xa04 + 7 = 11,\xa011 + 12 = 23\n수의 리스트가 주어졌을 때, 지민이가 모든 수를 다 짝지었을 때, 첫 번째 수와 어떤 수를 짝지었는지 오름차순으로 출력하는 프로그램을 작성하시오. 위의 예제에서 1 + 12 = 13으로 소수이다. 그러나, 남은 4개의 수를 합이 소수가 되게 짝지을 수 있는 방법이 없다. 따라서 위의 경우 정답은 4, 10이다.\n', 'inputFormat': '\n첫째 줄에 리스트의 크기 N이 주어진다. N은 50보다 작거나 같은 자연수이며, 짝수이다. 둘째 줄에 리스트에 들어있는 수가 주어진다. 리스트에 들어있는 수는 1,000보다  작거나 같은 자연수이며, 중복되지 않는다.\n', 'outputFormat': '\n첫째 줄에 정답을 출력한다. 없으면 -1을 출력한다.\n', 'I/O_sample': [{'input': '6\n1 4 7 10 11 12\n', 'output': '4 10\n'}, {'input': '6\n11 1 4 7 10 12\n', 'output': '12\n'}, {'input': '4\n8 9 1 14\n', 'output': '-1\n'}, {'input': '8\n34 39 32 4 9 35 14 17\n', 'output': '9 39\n'}, {'input': '20\n941 902 873 841 948 851 945 854 815 898 806 826 976 878 861 919 926 901 875 864\n', 'output': '806 926\n'}], 'algorithmType': ['수학', '정수론', '소수 판정', '에라토스테네스의 체', '이분 매칭']}" };
    const correctAnswerMessage = {
      role: 'assistant', content: `다음은 정답 코드야. GPT가 응답 할 때 이용하면 돼.
import sys
import math

def dfs(x):
    global Y
    global matched
    global visited
    if visited[Y.index(x)]: return False
    visited[Y.index(x)] = True
    for y in Y:
        if x + y in primes:
            if y not in matched or dfs(matched[y]):
                matched[y] = x
                return True
    return False

N = int(sys.stdin.readline())
X = list(map(int, sys.stdin.readline().split()))
# X.sort()

# 소수 목록을 미리 준비
primes = []
for i in range(2, 2000):
    is_prime = True
    for j in range(2, i):
        if i % j == 0:
            is_prime = False
            break
    if is_prime: primes.append(i)
    else: continue

answers = []
for i in X:
    matched = {}
    if i == X[0]: continue
    if X[0] + i in primes:
        if N == 2:
            answers.append(i)
            break
        # print(i)
        # 첫번째 숫자와 현재 매치된 숫자를 제외한 새 리스트 생성
        Y = [x for x in X]
        del Y[0]
        del Y[Y.index(i)]
        matched = {}
        for y in Y:
            visited = [False for _ in range(len(Y))]
            dfs(y)
    
    # if matched: print(matched)
    if N != 2 and len(matched) == N - 2: answers.append(i)

if not answers:
    answers.append(-1)

answers.sort()

print(' '.join(list(map(str, answers))))
`};

    const answerMessage = { role: 'user', content: `작성한 코드: \n ${code} \n 나의 content: ${chatInput}` };
    const userMessage = { role: 'user', content: chatInput };
    setMessages([...messages, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      console.log([systemMessage, ...messages, correctAnswerMessage, answerMessage, userMessage])
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [systemMessage, ...messages, correctAnswerMessage, answerMessage],
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
                onClick={handleSubmitExample}
              >
                예제 테스트
              </button>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={handleSubmitBOJ}
              >
                백준 제출하기
              </button>
              <button
                type="button"
                className={styles.outlineButton}
              >
                파일 저장
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            backgroundColor: 'transparent'
          }}>
            <div style={{
              height: '550px',
              width: '550px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              overflowY: 'scroll',
              marginBottom: '10px',
              backgroundColor: 'white'
            }}>
              {messages
                .filter(msg => msg.role !== 'system')
                .map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                      margin: '20px 0',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '20px',
                        borderRadius: '30px',
                        backgroundColor: msg.role === 'user' ? '#d1f7c4' : '#f1f1f1',
                        maxWidth: '80%',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            // Style code blocks
                            code: ({ node, inline, className, children, ...props }) => (
                              <code
                                className={className}
                                style={{
                                  display: inline ? 'inline' : 'block',
                                  overflow: 'auto',
                                  maxWidth: '100%',
                                  padding: inline ? '0px 0px' : '10px',
                                  backgroundColor: '#f6f8fa',
                                  borderRadius: '4px',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word'
                                }}
                                {...props}
                              >
                                {children}
                              </code>
                            ),
                            // Style paragraphs
                            p: ({ children }) => (
                              <p style={{
                                margin: '-17px 0 0 0',
                                wordBreak: 'break-word',
                                overflow: 'auto'
                              }}>
                                {children}
                              </p>
                            ),
                            // Style pre blocks
                            pre: ({ children }) => (
                              <pre style={{
                                maxWidth: '100%',
                                overflow: 'auto',
                                margin: '10em 0',
                                padding: '4px',
                                backgroundColor: '#f6f8fa',
                                borderRadius: '4px'
                              }}>
                                {children}
                              </pre>
                            ),
                            // Update list styling with better nesting support
                            ul: ({ children }) => (
                              <ul style={{
                                paddingLeft: '20px',
                                margin: '0em 0',
                                listStyleType: 'disc'
                              }}>
                                {children}
                              </ul>
                            ),
                            // Update list items with better nesting
                            li: ({ children, ordered }) => (
                              <li style={{
                                marginBottom: '0em',
                                listStyleType: ordered ? 'decimal' : 'disc',
                                textAlign: 'left',
                                display: 'list-item'
                              }}>
                                {children}
                              </li>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
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
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
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
        </div>
        {/* Modal Component */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Modal Title</h2>
              <p>This is a pop-up message.</p>
              <button onClick={toggleModal}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
