/* =========================================
   [로그인 페이지] 탭 전환 기능
========================================= */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

/* =========================================
   [로그인 페이지] 로그인 상태 표시 및 실행
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 🚨 [추가] 엔딩 후 잠금 상태 체크
    if (localStorage.getItem('endGameLock') === 'true') {
        document.body.classList.add('horror-mode'); // 핏빛 디자인 강제 적용
        
        // 헤더의 다른 메뉴(내 호실, 이용 수칙 등) 클릭 차단
        document.querySelectorAll('nav a').forEach(link => {
            if (link.textContent.trim() !== '로그아웃') {
                link.style.pointerEvents = 'none';
                link.style.color = '#333';
            }
        });
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    
    const loginTabContent = document.querySelectorAll('.tab-content')[0];
    const resetTabContent = document.querySelectorAll('.tab-content')[1];

    // ----------------------------------------------------
    // 🚨 1. [초기화 탭 로직] 
    // ----------------------------------------------------
    if (resetTabContent) {
        const resetBtn = resetTabContent.querySelector('.submit-btn') || resetTabContent.querySelector('button');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if(confirm("모든 데이터를 초기화하고 처음부터 다시 시작하시겠습니까?")) {
                    localStorage.clear(); // 🚨 엔딩 잠금 포함 모든 데이터 삭제
                    alert('초기화되었습니다. 다시 방문해 주세요.');
                    window.location.href = 'index.html'; 
                }
            });
        }
    }

    // ----------------------------------------------------
    // 2. 이미 로그인을 한 상태일 경우
    // ----------------------------------------------------
    if (isLoggedIn === 'true' && userName && loginTabContent) {
        loginTabContent.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <h3 style="font-size: 1.6rem; color: #b8860b; margin-bottom: 15px; font-weight: bold;">
                    ${userName}님, 환영합니다.
                </h3>
                <p style="color: #666; margin-bottom: 40px; line-height: 1.6;">
                    이미 Golden Hotel에 방문자 등록을 마치셨습니다.<br>
                    안전하고 편안한 투숙 되시길 바랍니다.
                </p>
            </div>
        `;
        return; 
    }

    // ----------------------------------------------------
    // 3. 로그인을 하지 않은 초기 상태일 경우
    // ----------------------------------------------------
    if (loginTabContent) {
        const loginBtn = loginTabContent.querySelector('.submit-btn') || loginTabContent.querySelector('button');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                
                const nicknameInput = loginTabContent.querySelector('input[type="text"]');
                const nickname = nicknameInput ? nicknameInput.value : '';
                
                if (nickname.trim() === '') {
                    alert('방문자님의 이름을 입력해주세요!');
                    return;
                }

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', nickname);

                alert(`환영합니다, ${nickname}님.\nGolden Hotel 접속이 승인되었습니다.`);
                window.location.href = 'index.html'; 
            });
        }
    }
});