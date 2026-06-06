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
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    
    // 첫 번째 탭(로그인 영역)과 두 번째 탭(초기화 영역)을 확실히 따로 찾습니다.
    const loginTabContent = document.querySelectorAll('.tab-content')[0];
    const resetTabContent = document.querySelectorAll('.tab-content')[1];

    // ----------------------------------------------------
    // 🚨 1. [초기화 탭 로직] 로그인 상태와 무관하게 무조건 제일 먼저 활성화시킵니다.
    // ----------------------------------------------------
    if (resetTabContent) {
        // 두 번째 탭 안에 있는 전송 버튼을 찾습니다.
        const resetBtn = resetTabContent.querySelector('.submit-btn') || resetTabContent.querySelector('button');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear(); 
                alert('모든 데이터가 초기화되었습니다. 처음부터 다시 시작합니다.');
                window.location.reload(); 
            });
        }
    }

    // ----------------------------------------------------
    // 2. 이미 로그인을 한 상태일 경우 (첫 번째 탭만 환영 메시지로 교체)
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

        return; // 로그인 로직은 여기서 정지 (하지만 이미 위에서 초기화 버튼은 세팅 완료됨!)
    }

    // ----------------------------------------------------
    // 3. 로그인을 하지 않은 초기 상태일 경우 (로그인 버튼 활성화)
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
                window.location.href = 'index.html'; // 메인 홈으로 이동
            });
        }
    }
});