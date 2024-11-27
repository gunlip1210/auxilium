'use client';

import { useState, useEffect } from 'react';
import '../styles/globals.css';
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

    const slides = [
        {
            id: 1569,
            title: '[토마토]',
            description: '★ 35.59%의 정답 비율',
            subText: '라이벌 "뜨포"님이 1일전 풀었습니다',
            style: {
                margin: 0,
                padding: '20px',
                background: 'rgba(44, 51, 63, 0.8)',
                borderRadius: '15px'
            }
        },
        {
            id: 1339,
            title: '[단어수학]',
            description: '★ c++ 추천 문제 ★ 브라운(ready) 알고리즘',
            subText: '"YOON"님과의 라이벌 집가고싶다님이 3일전 풀었습니다',
            style: {
                margin: 0,
                padding: '20px',
                background: 'rgba(44, 51, 63, 0.8)',
                borderRadius: '15px'
            }
        },
        {
            id: 9663,
            title: '[N-Queen]',
            description: '★ java 추천 문제',
            subText: 'GOLD 레벨 문제입니다',
            style: {
                margin: 0,
                padding: '20px',
                background: 'rgba(44, 51, 63, 0.8)',
                borderRadius: '15px'
            }
        },
        {
            id: 2580,
            title: '[스도쿠]',
            description: '백트래킹 문제',
            subText: '실버 레벨 문제입니다'
        },
        {
            id: 14888,
            title: '[연산자 끼워넣기]',
            description: '구현 문제',
            subText: '브론즈 레벨 문제입니다'
        }
    ];

    const [cards, setCards] = useState([
        {
            position: 'left',
            ...slides[slides.length - 1]
        },
        {
            position: 'center',
            ...slides[0]
        },
        {
            position: 'right',
            ...slides[1]
        }
    ]);

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSlideDirection('next');

        setCards(prevCards => {
            const newCards = prevCards.map(card => {
                switch (card.position) {
                    case 'left':
                        return { ...card, position: 'outside-left' };
                    case 'center':
                        return { ...card, position: 'left' };
                    case 'right':
                        return { ...card, position: 'center' };
                    default:
                        return card;
                }
            });

            const nextIndex = (currentSlide + 2) % slides.length;
            newCards.push({
                position: 'right',
                ...slides[nextIndex]
            });

            return newCards;
        });

        setTimeout(() => {
            setCards(prevCards => prevCards.filter(card => card.position !== 'outside-left'));
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsAnimating(false);
        }, 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSlideDirection('prev');

        setCards(prevCards => {
            const newCards = prevCards.map(card => {
                switch (card.position) {
                    case 'left':
                        return { ...card, position: 'center' };
                    case 'center':
                        return { ...card, position: 'right' };
                    case 'right':
                        return { ...card, position: 'outside-right' };
                    default:
                        return card;
                }
            });

            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            newCards.unshift({
                position: 'left',
                ...slides[prevIndex]
            });

            return newCards;
        });

        setTimeout(() => {
            setCards(prevCards => prevCards.filter(card => card.position !== 'outside-right'));
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
        // 백준 문제 페이지를 새 탭에서 열기
        window.open(`https://www.acmicpc.net/problem/${problemId}`, '_blank');

        // code_page로 이동
        router.push(`/code_page?id=${problemId}`);
    };

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
                <button className="carousel-button prev" onClick={prevSlide}>
                    <span className="arrow">&#10094;</span>
                </button>

                <div className="carousel-slide">
                    {getVisibleSlides().map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`problem-card ${index === 1 ? 'position-center' :
                                index === 0 ? 'position-left' : 'position-right'}`}
                            onClick={() => handleCardClick(slide.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{
                                fontSize: '4rem',
                                color: '#4CAF50',
                                fontWeight: 'bold',
                                marginBottom: '0.3rem'
                            }}>
                                {slide.id}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                color: '#8b95a1',
                                marginBottom: '0.6rem',
                                float: 'right',
                                marginTop: '-3rem'
                            }}>
                                {slide.title}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#ffffff',
                                marginBottom: '0.3rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ color: '#ffffff' }}>★ c++ 추천 문제</span>
                                <span style={{ color: '#0984e3' }}>★ 그리디(greedy) 알고리즘</span>
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#ffffff',
                                lineHeight: '1.4'
                            }}>
                                ★ {slide.subText}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="carousel-button next" onClick={nextSlide}>
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
