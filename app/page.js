'use client';

import { useState, useEffect } from 'react';
import './styles/globals.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  // State control for the side menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the side menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // State for the search input
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery) {
      window.open(`https://www.acmicpc.net/problem/${searchQuery}`, '_blank');
    }
  };

  // Add carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [slides, setSlides] = useState([]);

  // Add useEffect to fetch recommendations on component mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Add fetch function
  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recommendations');
      }

      const data = await response.json();

      console.log(data);
      // `problem_info` 배열 추출 후 매핑
      const newSlides = data.problem_info.map(problem => ({
        id: problem.num, // 문제 번호
        title: problem.tit, // 제목
        description: problem.des, // 설명
        difficulty: problem.dif, // 난이도
        reason: problem.res, // 설명 이유
        style: {
          margin: 0,
          padding: '20px',
          background: 'rgba(44, 51, 63, 0.8)', // 배경색
          borderRadius: '15px' // 모서리 둥글게
        }
      }));

      setSlides(newSlides);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setSlides([]); // or some default slides
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    if (isLoading || isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev + 1) % slides.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isLoading || isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play (optional)
  useEffect(() => {
    // 초기 설정만 수행하고 자동 슬라이드는 제거
  }, []);

  const getVisibleSlides = () => {
    if (isLoading || slides.length === 0) {
      // Return loading placeholder slides with unique keys
      return Array(3).fill(null).map((_, index) => ({
        id: `loading-${index}`,  // Unique keys remain static
        title: <span className="loading-text">Loading...</span>, // Add flashing effect to text
        description: <span className="loading-text">Please wait</span>,
        subText: <span className="loading-text">Fetching recommendations...</span>,
      }));
    }

    const slidesCopy = [...slides];
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    const nextIndex = (currentSlide + 1) % slides.length;

    return [
      slidesCopy[prevIndex],
      slidesCopy[currentSlide],
      slidesCopy[nextIndex]
    ];
  };

  // 새로운 state 추가
  const [bottomSearchQuery, setBottomSearchQuery] = useState('');

  // 두 번째 검색창을 위한 새로운 핸들러
  const handleBottomSearch = () => {
    if (bottomSearchQuery) {
      window.open(`https://www.acmicpc.net/search#q=${encodeURIComponent(bottomSearchQuery)}`, '_blank');
    }
  };

  const router = useRouter();

  // 카드 클릭 핸들러 추가
  const handleCardClick = (problemId) => {
    // Get the current slide's data
    const currentProblem = slides[currentSlide];

    // 백준 문제 페이지를 새 탭에서 열기
    window.open(`https://www.acmicpc.net/problem/${problemId}`, '_blank');

    // code_page로 이동 (title 포함)
    router.push(`/code_page?problemId=${problemId}&title=${encodeURIComponent(currentProblem.title)}`);
  };

  const username = 'a_star'; // Example username

  // Add this handler function near your other handlers
  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <a href="/">
          <img src="/icon.svg" alt="Logo" className="logo-icon" />
        </a>
        <div className="header-right">
          <button
            className="username"
            onClick={() => window.open(`https://www.acmicpc.net/user/${username}`, '_blank')}
          >
            {username}
          </button>
          <button className="logout-button" onClick={handleLogout}>logout</button>
          <img
            src="/sideMenu.svg"
            alt="side menu"
            className="menu-icon"
            onClick={toggleMenu}
          />
        </div>
      </header>

      {/* Search Bar Below the Header */}
      <div className="search-bar-container">
        <div className="search-bar">
          <img
            src="/search.svg"
            alt="Search Icon"
            className="search-icon"
            onClick={handleSearch}
          />
          <input
            type="text"
            className="search-text"
            placeholder="문제번호를 입력해주세요"
            value={searchQuery}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, '');
              setSearchQuery(onlyNums);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Side Menu */}
      <div className={`menu-panel ${isMenuOpen ? 'open' : ''}`}>
        <button onClick={toggleMenu} className="close-button">✖</button>
        <ul>
          <li><a href="/">여기 뭐 로그인 정보 들어가겠죠?</a></li>
          <li><a href="https://www.acmicpc.net/">또 뭐 백준돌아가는 링크도?</a></li>
        </ul>
      </div>

      {/* Spacer */}
      <div className="spacer"></div>

      {/* Title Section */}
      <div className="title-container">
        <h1 className="recommend-title">
          추천문제
          <img src="/asteriks.svg" alt="Asterisk" className="asterisk-image" />
        </h1>
      </div>

      {/* Carousel Section */}
      <div className="carousel-container">
        <button
          className="carousel-button prev"
          onClick={prevSlide}
          disabled={isLoading || slides.length === 0}
          style={{ opacity: isLoading || slides.length === 0 ? 0.5 : 1 }}
        >
          <span className="arrow">&#10094;</span>
        </button>

        <div className="carousel-slide">
          {getVisibleSlides().map((slide, index) => (
            <div
              key={slide.id}
              className={`problem-card ${index === 1 ? 'position-center' :
                index === 0 ? 'position-left' : 'position-right'} ${isLoading ? 'loading' : ''}`}
              onClick={() => !isLoading && handleCardClick(slide.id)}
              style={{ cursor: isLoading ? 'default' : 'pointer' }}
            >
              <div className="problem-header">
                <div className="problem-number">
                  {slide.id}
                </div>
                <div className="problem-title">
                  [{slide.title}]
                </div>
              </div>
              <div className="problem-content">
                {!isLoading && (
                  <>
                    <div className="problem-tags">
                      <span className="tag">★ {slide.description}      <span className="difficulty-tag"># {slide.difficulty}</span></span>
                      <span className="problem-reason">★ {slide.reason}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-button next"
          onClick={nextSlide}
          disabled={isLoading || slides.length === 0}
          style={{ opacity: isLoading || slides.length === 0 ? 0.5 : 1 }}
        >
          <span className="arrow">&#10095;</span>
        </button>

        {/* 캐러셀 점 추가 */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* 두 번째 검색창 수정 */}
      <div className="bottom-search-container">
        <h2 className="search-title">어떤 문제를 찾아드릴까요?</h2>
        <div className="bottom-search-bar">
          <input
            type="text"
            className="bottom-search-text"
            placeholder="아무거나 물어보세요!"
            value={bottomSearchQuery}
            onChange={(e) => setBottomSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleBottomSearch();
              }
            }}
          />
          <button className="search-button" onClick={handleBottomSearch}>
            <span className="arrow">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
