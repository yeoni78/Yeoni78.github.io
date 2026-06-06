/* =========================================
   [공통] 스크롤 시 헤더 배경색 변경 (기존 기능)
========================================= */
window.addEventListener('scroll', () => {
    const header = document.querySelector('header'); 
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

/* =========================================
   [공통] 출입 통제 및 로그인 / 🚨 괴담 상태 시스템
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isHorrorMode = localStorage.getItem('horrorMode'); // 🚨 호러 모드 감지

    // =========================================
    // 🚨 [추가됨] 호러 모드가 켜져있다면, 다른 페이지에 가도 무조건 강제 반전!
    // =========================================
    if (isHorrorMode === 'true') {
        document.body.classList.add('horror-mode');
    }

    // 1. 상단 헤더 '로그인/로그아웃' 글자 처리 (기존 기능)
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    if (isLoggedIn === 'true' && loginLink) {
        // 호러 모드일 때는 초록색 불빛도 핏빛(빨강)으로 변하게 만드는 디테일 추가
        const dotColor = isHorrorMode === 'true' ? '#ff0000' : '#28a745';
        const shadowColor = isHorrorMode === 'true' ? 'rgba(255, 0, 0, 0.6)' : 'rgba(40, 167, 69, 0.6)';
        
        loginLink.innerHTML = `로그아웃 <span class="login-dot" style="background-color: ${dotColor}; box-shadow: 0 0 5px ${shadowColor};"></span>`;
    }

    // 통제 구역 리스트
    const restrictedPages = ['find-room.html', 'my-room.html', 'rules.html'];

    // 2. 메뉴 버튼 클릭 즉시 차단 (기존 기능)
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetPage = link.getAttribute('href');
            if (restrictedPages.includes(targetPage) && isLoggedIn !== 'true') {
                e.preventDefault(); 
                alert('로그인이 필요한 서비스입니다.\n방문자 등록(로그인)을 먼저 진행해 주세요.');
                window.location.href = 'login.html'; 
            }
        });
    });

    // 3. 주소창 직접 입력 방어 (기존 기능)
    const currentPage = window.location.pathname.split('/').pop();
    if (restrictedPages.includes(currentPage) && isLoggedIn !== 'true') {
        alert('잘못된 접근입니다.\n방문자 등록(로그인)을 먼저 진행해 주세요.');
        window.location.href = 'login.html'; 
    }
});