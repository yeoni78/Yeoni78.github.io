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
    // 🚨 [수정됨] 숙박하기 -> 지지직 -> 시작하기 (클릭 시 rules.html 이동)
    // =========================================
    const buttons = document.querySelectorAll('button');
    let enterRoomBtn = null;
    buttons.forEach(btn => {
        if (btn.textContent.includes('숙박하기')) enterRoomBtn = btn;
    });

    if (enterRoomBtn) {
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

                // 3. 텍스트를 '시작하기'로 변경하고 버튼 다시 활성화
                enterRoomBtn.textContent = "시작하기";
                enterRoomBtn.style.pointerEvents = "auto";
                enterRoomBtn.style.backgroundColor = "#4a0000"; 

                alert("철컥... 문이 밖에서 잠겼습니다.\n\n이제 되돌아갈 수 없습니다.");

                // 4. 기존 이벤트를 지우고 새 이벤트(페이지 이동) 부여
                enterRoomBtn.removeEventListener('click', initHorror);
                
                // 🚨 수정된 부분: 버튼 클릭 시 호텔 이용 수칙 페이지로 강제 납치!
                enterRoomBtn.addEventListener('click', () => {
                    window.location.href = 'rules.html';
                });

            }, 1200); 
        });
    }
});