/* =========================================
   [내 호실 페이지] 철통 보안 및 데이터 렌더링
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const savedTitle = localStorage.getItem('bookedTitle');
    const savedAddress = localStorage.getItem('bookedAddress');

    if (!savedTitle || !savedAddress) {
        alert("접근 불가: 먼저 호실을 예약해 주세요!");
        window.location.href = "find-room.html"; 
        return; 
    }

    const titleEl = document.getElementById('my-room-title');
    const addrEl = document.getElementById('my-room-address');
    if (titleEl) titleEl.textContent = savedTitle;
    if (addrEl) addrEl.textContent = savedAddress;

    // =========================================
    // 🚨 [수정됨] 숙박하기 -> 지지직 -> 시작하기 전환 연출
    // =========================================
    const buttons = document.querySelectorAll('button');
    let enterRoomBtn = null;
    buttons.forEach(btn => {
        if (btn.textContent.includes('숙박하기')) enterRoomBtn = btn;
    });

    if (enterRoomBtn) {
        // 처음 한 번만 실행되도록 기명 함수(initHorror)로 묶습니다.
        enterRoomBtn.addEventListener('click', function initHorror() {
            
            // 1. 클릭 즉시 버튼 무력화 및 노이즈 효과 시작
            enterRoomBtn.textContent = "......";
            enterRoomBtn.style.pointerEvents = "none";
            document.body.classList.add('glitch-active');

            // 2. 1.2초 뒤 노이즈 종료 및 호러 모드 전환
            setTimeout(() => {
                document.body.classList.remove('glitch-active');
                document.body.classList.add('horror-mode');
                localStorage.setItem('horrorMode', 'true');

                // 🚨 3. 텍스트를 '시작하기'로 변경하고 버튼 다시 활성화
                enterRoomBtn.textContent = "시작하기";
                enterRoomBtn.style.pointerEvents = "auto";
                enterRoomBtn.style.backgroundColor = "#4a0000"; // 진한 핏빛으로 변경

                alert("철컥... 문이 밖에서 잠겼습니다.\n\n이제 되돌아갈 수 없습니다.");

                // 4. 이제 이 버튼은 '숙박하기'가 아니므로 기존 이벤트를 지우고 새 이벤트를 줍니다.
                enterRoomBtn.removeEventListener('click', initHorror);
                
                enterRoomBtn.addEventListener('click', () => {
                    // 🎮 [여기에 다음 기믹 추가] 시작하기 버튼을 눌렀을 때 일어날 일!
                    alert("진정한 Golden Hotel의 이면에 오신 것을 환영합니다...\n(여기에 방탈출 게임 시작 화면을 띄우면 됩니다)");
                });

            }, 1200); 
        });
    }
});