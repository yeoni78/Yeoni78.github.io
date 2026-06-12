/* =========================================
   [호실 찾기] 오직 '주사위 매칭 시스템'만 작동
========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // 브랜드별 기본 정보
    const brandData = {
        magicbunny: { title: "매직버니 아케이드", address: "테마파크시 판타지구 환상대로 777" },
        bluedream: { title: "블루드림 워터파크", address: "오션월드시 마린구 푸른바다길 104" },
        flower: { title: "플라워 리조트", 리조트: "블라썸군 가든면 향기로운 정원로 23" }
    };

    // 주사위 모양 텍스트 맵핑
    const diceUnicode = {
        1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅', 7: '❓' 
    };

    // DOM 요소 찾기
    const roomCardsList = document.getElementById('room-cards-list');
    const resultCountText = document.getElementById('result-count');
    const brandBtns = document.querySelectorAll('.brand-btn');
    const rollDiceBtn = document.getElementById('btn-roll-dice');
    
    const diceElements = [
        document.getElementById('dice-1'),
        document.getElementById('dice-2'),
        document.getElementById('dice-3')
    ];

    let currentBrand = 'magicbunny';
    let isRolling = false; 

    /* =========================================
       1. 초기 화면 세팅 (무조건 방 목록 지우기!)
    ========================================= */
    function initCustomMode() {
        // 🚨 HTML에 방이 몇 개가 적혀있든 무시하고 싹 지운 뒤 안내 문구만 띄움
        if (roomCardsList) {
            roomCardsList.innerHTML = `
                <div style="text-align:center; padding: 100px 0; color:#666; font-size: 1.2rem;">
                    우측의 주사위를 굴려 운명을 시험해 보세요.
                </div>
            `;
        }
        if (resultCountText) {
            resultCountText.textContent = `검색 결과 (0)`;
        }
        
        diceElements.forEach(d => { d.textContent = '⚀'; d.style.color='#222'; });
    }

    /* =========================================
       2. 함수: 호실 리스트 렌더링
    ========================================= */
    function renderRoomList(roomsToRender) {
        roomCardsList.innerHTML = '';
        if(resultCountText) resultCountText.textContent = `검색 결과 (${roomsToRender.length})`;
        
        const brandInfo = brandData[currentBrand] || brandData['magicbunny'];

        roomsToRender.forEach(roomNum => {
            let roomTitle = `${brandInfo.title} [${roomNum}호]`;
            let roomAddr = brandInfo.address;
            
            // 🚨 1. 선택된 브랜드에 따라 이미지 접두사(앞부분) 결정
            let imagePrefix = 'red_room'; // 기본값 (매직버니)
            if (currentBrand === 'bluedream') imagePrefix = 'blue_room';
            else if (currentBrand === 'flower') imagePrefix = 'Y_room';

            // 🚨 2. 777호 당첨 시 텍스트 및 이미지 분기 처리
            let imgTag = '';
            if(roomNum === 777) {
                roomTitle = `🚨 [VIP 히든 룸] 황금의 방 777호`;
                roomAddr = "경고: 이 호실의 위치는 추적할 수 없습니다.";
                // 777호 전용 이미지 (캡처해주신 777.png)
                imgTag = `<img src="image/777.png" alt="황금의 방 777호">`;
            } else {
                // 일반 방 이미지 (예: image/red_room_101.png)
                imgTag = `<img src="image/${imagePrefix}_${roomNum}.png" alt="${roomNum}호">`;
            }

            // 🚨 3. HTML 카드 생성 (배경색 바꾸는 복잡한 인라인 스타일 제거, 깔끔하게 imgTag만 삽입)
            const cardHtml = `
                <div class="room-card" style="animation: fadeIn 0.5s ease;">
                    <div class="room-img-placeholder">
                        ${imgTag}
                    </div>
                    <div class="room-info">
                        <h3 style="${roomNum === 777 ? 'color: #b8860b; font-weight: 900;' : ''}">${roomTitle}</h3>
                        <div class="room-details">
                            <p><span class="label">주소</span> ${roomAddr}</p>
                            <p><span class="label">체크인/아웃</span> 15:00 / 11:00</p>
                        </div>
                    </div>
                    <div class="room-action-zone">
                        <button class="action-btn btn-view">바로가기</button>
                        <button class="action-btn btn-book">예약하기</button>
                    </div>
                </div>
            `;
            roomCardsList.insertAdjacentHTML('beforeend', cardHtml);
        });
    }
    /* =========================================
       3. 주사위 굴리기 기믹 (10% 확률로 777호)
    ========================================= */
    if(rollDiceBtn) {
        rollDiceBtn.addEventListener('click', () => {
            if (isRolling) return; 
            isRolling = true;
            rollDiceBtn.disabled = true;
            rollDiceBtn.textContent = '굴러가는 중...';
            
            roomCardsList.innerHTML = '<div style="text-align:center; padding: 100px 0; color:#999; font-size: 1.2rem;">주사위 결과를 기다리는 중...</div>';

            let rollCount = 0;
            const interval = setInterval(() => {
                diceElements.forEach(dice => {
                    const randomVisual = Math.floor(Math.random() * 6) + 1;
                    dice.textContent = diceUnicode[randomVisual];
                });
                rollCount++;
                if(rollCount > 10) clearInterval(interval);
            }, 70);

            setTimeout(() => {
                let finalDice = [];
                let matchedRooms = [];

                const jackpotChance = Math.floor(Math.random() * 100);
                
                if (jackpotChance < 10) {
                    finalDice = [7, 7, 7];
                    matchedRooms = [777];
                } else {
                    for(let i=0; i<3; i++) {
                        finalDice.push(Math.floor(Math.random() * 6) + 1);
                    }
                    const uniqueNumbers = [...new Set(finalDice)];
                    uniqueNumbers.sort().forEach(num => {
                        matchedRooms.push(num * 100 + num);
                    });
                }

                diceElements.forEach((dice, index) => {
                    dice.textContent = diceUnicode[finalDice[index]];
                    if(finalDice[index] === 7) {
                        dice.style.color = '#d9534f';
                        dice.textContent = '7'; 
                    } else {
                        dice.style.color = '#222';
                    }
                });

                renderRoomList(matchedRooms);
                isRolling = false;
                rollDiceBtn.disabled = false;
                rollDiceBtn.textContent = '주사위 굴리기';

            }, 1000);
        });
    }

    /* =========================================
       4. 브랜드 스위칭 이벤트 
    ========================================= */
    brandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            brandBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBrand = btn.getAttribute('data-brand');
            
            // 브랜드가 바뀌면 무조건 방 목록을 다시 비우고 주사위를 굴리도록 유도
            initCustomMode();
        });
    });

    /* =========================================
       5. 예약 및 바로가기 로직 (localStorage)
    ========================================= */
    if(roomCardsList) {
        roomCardsList.addEventListener('click', (e) => {
            const card = e.target.closest('.room-card');
            if (!card) return; 

            if (e.target.classList.contains('btn-book')) {
                const roomTitle = card.querySelector('h3').textContent;
                const roomAddress = card.querySelector('.room-details p').textContent.replace('주소', '').trim(); 
                
                localStorage.setItem('bookedTitle', roomTitle);
                localStorage.setItem('bookedAddress', roomAddress);
                
                alert(`[${roomTitle}] 예약이 완료되었습니다!\n이제 '바로가기' 버튼을 눌러 객실로 이동하세요.`);
            } 
            else if (e.target.classList.contains('btn-view')) {
                window.location.href = 'my-room.html';
            }
        });
    }

    // 🚨 페이지가 처음 켜졌을 때 무조건 한 번 실행해서 화면을 깨끗하게 정리!
    initCustomMode();
});