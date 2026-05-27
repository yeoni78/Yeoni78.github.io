/* =========================================
   [로그인 페이지] 탭 전환 기능
========================================= */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. 모든 탭 버튼과 내용에서 'active' 클래스 제거
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // 2. 클릭한 버튼에 'active' 클래스 추가 (밑줄 생김)
        btn.classList.add('active');

        // 3. 클릭한 버튼의 data-target 값과 일치하는 내용 보여주기
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

/* =========================================
   [로그인 페이지] 로그인 실행 & 데이터 초기화
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 페이지 내의 전송(submit) 버튼들을 모두 찾습니다.
    // (보통 첫 번째가 로그인 버튼, 두 번째가 초기화 버튼으로 구성되어 있습니다.)
    const submitBtns = document.querySelectorAll('.submit-btn');

    // 1. [로그인] 버튼 처리 (첫 번째 버튼)
    if (submitBtns.length > 0) {
        submitBtns[0].addEventListener('click', (e) => {
            e.preventDefault(); // 폼 기본 제출(새로고침) 방지
            
            // 닉네임(아이디) 입력값 가져오기
            const nicknameInput = document.querySelector('#login-form input[type="text"]');
            const nickname = nicknameInput ? nicknameInput.value : '';
            
            if (nickname.trim() === '') {
                alert('닉네임(방문자 이름)을 입력해주세요!');
                return;
            }

            // 브라우저에 '로그인 완료' 도장 찍기
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', nickname);

            alert(`환영합니다, ${nickname}님.\nGolden Hotel 접속이 승인되었습니다.`);
            
            // 로그인 성공 시 자연스럽게 다음 코스인 '호실 찾기'로 이동 유도
            window.location.href = 'index.html';
        });
    }

    // 2. [초기화] 버튼 처리 (두 번째 버튼)
    if (submitBtns.length > 1) {
        submitBtns[1].addEventListener('click', (e) => {
            e.preventDefault();
            
            // 브라우저에 저장된 모든 기억(로그인, 예약한 방 등)을 파괴!
            localStorage.clear(); 
            
            alert('모든 데이터가 초기화되었습니다. 처음부터 다시 시작합니다.');
            
            // 화면을 새로고침하여 초기화 상태 반영
            window.location.reload(); 
        });
    }
});