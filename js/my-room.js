/* =========================================
   [내 호실 페이지] 철통 보안 및 데이터 렌더링
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 브라우저에 저장된 예약증(데이터) 확인
    const savedTitle = localStorage.getItem('bookedTitle');
    const savedAddress = localStorage.getItem('bookedAddress');

    // 2. 예약증이 없으면 강제로 쫓아내기 (접근 차단)
    if (!savedTitle || !savedAddress) {
        alert("접근 불가: 먼저 호실을 예약해 주세요!");
        // 확인을 누르면 강제로 호실 찾기 페이지로 돌려보냅니다
        window.location.href = "find-room.html"; 
        return; // 아래 코드가 실행되지 않도록 여기서 스크립트 정지
    }

    // 3. 예약증이 있다면 기본값(101호)을 지우고 내가 예약한 303호 등으로 덮어쓰기
    document.getElementById('my-room-title').textContent = savedTitle;
    document.getElementById('my-room-address').textContent = savedAddress;
});

/* =========================================
   [내 호실 페이지] 인터랙션 및 괴담 트리거
========================================= */
const enterRoomBtn = document.getElementById('btn-enter-room');

if (enterRoomBtn) {
    enterRoomBtn.addEventListener('click', () => {
        alert("철컥... 문이 잠겼습니다.\n이제 되돌아갈 수 없습니다.");
        
        enterRoomBtn.textContent = "살려주세요";
        enterRoomBtn.style.backgroundColor = "#000000";
        enterRoomBtn.style.color = "#ff0000";
    });
}