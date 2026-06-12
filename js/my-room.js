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
    // 갤러리 이미지 랜덤 배정 로직 (여기 추가됨!)
    // =========================================
    const placeholders = document.querySelectorAll('.img-placeholder');
    let brandPrefix = 'red_room'; // 기본값
    if (savedTitle.includes('블루드림')) brandPrefix = 'blue_room';
    else if (savedTitle.includes('플라워')) brandPrefix = 'Y_room';

    const randomNums = [];
    while(randomNums.length < 3) {
        let r = Math.floor(Math.random() * 6) + 1;
        let num = r * 100 + r; 
        if(randomNums.indexOf(num) === -1) randomNums.push(num);
    }

    placeholders.forEach((el, index) => {
        const roomNum = randomNums[index];
        el.innerHTML = `<img src="image/${brandPrefix}_${roomNum}.png" alt="객실 사진" style="width:100%; height:100%; object-fit:cover;">`;
    });

    // =========================================
    // 🚨 숙박하기 -> 지지직 -> 시작하기 
    // =========================================
    const buttons = document.querySelectorAll('button');
    let enterRoomBtn = null;
    buttons.forEach(btn => {
        if (btn.textContent.includes('숙박하기')) enterRoomBtn = btn;
    });

    if (enterRoomBtn) {
        enterRoomBtn.addEventListener('click', function initHorror() {
            enterRoomBtn.textContent = "......";
            enterRoomBtn.style.pointerEvents = "none";
            document.body.classList.add('glitch-active');

            setTimeout(() => {
                document.body.classList.remove('glitch-active');
                document.body.classList.add('horror-mode');
                localStorage.setItem('horrorMode', 'true');

                enterRoomBtn.textContent = "시작하기";
                enterRoomBtn.style.pointerEvents = "auto";
                enterRoomBtn.style.backgroundColor = "#4a0000"; 

                alert("철컥... 문이 밖에서 잠겼습니다.\n\n이제 되돌아갈 수 없습니다.");

                enterRoomBtn.removeEventListener('click', initHorror);
                enterRoomBtn.addEventListener('click', () => {
                    window.location.href = 'rules.html';
                });
            }, 1200); 
        });
    }
});