// 1. 조종할 헤더 요소를 HTML의 id 값을 이용해 찾아옵니다.
const header = document.getElementById('main-header');

// 2. 사용자가 마우스 스크롤을 움직일 때마다 안의 내용을 실행합니다.
window.addEventListener('scroll', () => {
    // 3. 현재 스크롤 위치가 화면 맨 위에서부터 50px 이상 내려왔는지 확인합니다.
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
/* =========================================
   [공통] 출입 통제 및 로그인 상태 표시 시스템
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 브라우저에서 로그인 여부 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // 1. 상단 헤더 '로그인' 글자 옆에 원형 표시등 달아주기
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    if (isLoggedIn === 'true' && loginLink) {
        // 로그인 상태라면 이름 옆에 조그만 초록색 표시(login-dot) 추가
        loginLink.innerHTML = '로그인 <span class="login-dot"></span>';
    }

    // 통제 구역 리스트
    const restrictedPages = ['find-room.html', 'my-room.html', 'rules.html'];

    // 2. [추가된 철벽 방어] 메뉴 버튼을 클릭하는 순간 미리 차단하기
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 클릭한 버튼의 이동할 주소(href)를 가져옵니다.
            const targetPage = link.getAttribute('href');

            // 이동하려는 곳이 통제 구역인데 로그인을 안 했다면?
            if (restrictedPages.includes(targetPage) && isLoggedIn !== 'true') {
                e.preventDefault(); // 🚨 즉시 페이지 이동 취소 (현재 페이지에 머무름)
                alert('로그인이 필요한 서비스입니다.\n방문자 등록(로그인)을 먼저 진행해 주세요.');
                window.location.href = 'login.html'; // 로그인 페이지로 이동
            }
        });
    });

    // 3. 주소창에 직접 URL을 쳐서 몰래 들어오는 경우 방어 (최후의 보루)
    const currentPage = window.location.pathname.split('/').pop();
    if (restrictedPages.includes(currentPage) && isLoggedIn !== 'true') {
        alert('잘못된 접근입니다.\n방문자 등록(로그인)을 먼저 진행해 주세요.');
        window.location.href = 'login.html'; 
    }
});