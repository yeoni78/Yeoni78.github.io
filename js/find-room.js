/* =========================================
   [호실 찾기] 데이터 및 동적 주사위 매칭 시스템
========================================= */

// 브랜드별 기본 정보 가이드
const brandData = {
    magicbunny: { title: "매직버니 아케이드", address: "테마파크시 판타지구 환상대로 777" },
    bluedream: { title: "블루드림 워터파크", address: "오션월드시 마린구 푸른바다길 104" },
    flower: { title: "플라워 리조트", address: "블라썸군 가든면 향기로운 정원로 23" }
};

// 주사위 모양 텍스트 맵핑 (7은 이 세상에 없는 주사위 눈금 연출)
const diceUnicode = {
    1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅', 7: '❓' 
};

const defaultRooms = [101, 202, 303, 404, 505, 606];

// DOM 요소
const contentLayout = document.getElementById('content-layout');
const roomCardsList = document.getElementById('room-cards-list');
const resultCountText = document.getElementById('result-count');
const searchTabs = document.querySelectorAll('.search-tab-btn');
const brandBtns = document.querySelectorAll('.brand-btn');

// 주사위 DOM
const diceElements = [
    document.getElementById('dice-1'),
    document.getElementById('dice-2'),
    document.getElementById('dice-3')
];
const rollDiceBtn = document.getElementById('btn-roll-dice');

let currentTab = 'direct'; 
let currentBrand = 'magicbunny';
let isRolling = false; // 주사위 중복 클릭 방지

/* =========================================
   함수: 호실 리스트 렌더링
========================================= */
function renderRoomList(roomsToRender) {
    roomCardsList.innerHTML = '';
    resultCountText.textContent = `검색 결과 (${roomsToRender.length})`;
    const brandInfo = brandData[currentBrand];

    roomsToRender.forEach(roomNum => {
        // 777호일 때만 특별히 기괴하거나 아주 신비로운 분위기의 텍스트 매칭
        let roomTitle = `${brandInfo.title} [${roomNum}호]`;
        let roomAddr = brandInfo.address;
        
        if(roomNum === 777) {
            roomTitle = `🚨 [VIP 히든 룸] 황금의 방 777호`;
            roomAddr = "경고: 이 호실의 위치는 추적할 수 없습니다.";
        }

        const cardHtml = `
            <div class="room-card" style="animation: fadeIn 0.5s ease;">
                <div class="room-img-placeholder" style="${roomNum === 777 ? 'background-color: #fff7e6; color: #b8860b;' : ''}">
                    ${roomNum}호 이미지
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
   🎲 핵심: 주사위 굴리기 기믹 (777호 초저확률 포함)
========================================= */
if(rollDiceBtn) {
    rollDiceBtn.addEventListener('click', () => {
        if (isRolling) return; // 이미 굴러가는 중이면 무시
        isRolling = true;
        rollDiceBtn.disabled = true;
        rollDiceBtn.textContent = '굴러가는 중...';
        
        roomCardsList.innerHTML = '<div style="text-align:center; padding: 50px 0; color:#999;">주사위 결과를 기다리는 중...</div>';

        // 1. 드르륵 거리는 슬롯머신 효과음 연출 (인터벌)
        let rollCount = 0;
        const interval = setInterval(() => {
            diceElements.forEach(dice => {
                const randomVisual = Math.floor(Math.random() * 6) + 1;
                dice.textContent = diceUnicode[randomVisual];
            });
            rollCount++;
            if(rollCount > 10) clearInterval(interval);
        }, 70);

        // 2. 최종 결과 결정 (1.0초 후 확정)
        setTimeout(() => {
            let finalDice = [];
            let matchedRooms = [];

            // ⚡ 본 게임 확률 설정: 10% 확률로 777호 당첨! (0~99 중 10 미만일 때)
            const jackpotChance = Math.floor(Math.random() * 100);
            
            if (jackpotChance < 10) {
                // 🎉 10% 확률을 뚫었을 때: 777호 당첨 
                finalDice = [7, 7, 7];
                matchedRooms = [777];
            } else {
                // 일반 90% 확률: 1~6 눈금 3개 무작위 추출
                for(let i=0; i<3; i++) {
                    finalDice.push(Math.floor(Math.random() * 6) + 1);
                }
                // 중복 눈금 제거 후 방 번호 정렬 매칭 (예: [2, 2, 5] -> 202호, 505호)
                const uniqueNumbers = [...new Set(finalDice)];
                uniqueNumbers.sort().forEach(num => {
                    matchedRooms.push(num * 100 + num);
                });
            }

            // 3. 주사위 화면에 최종 유니코드 박기 (기존과 동일)
            diceElements.forEach((dice, index) => {
            });

            // 4. 왼쪽 화면에 결과 방 렌더링 및 상태 해제
            renderRoomList(matchedRooms);
            isRolling = false;
            rollDiceBtn.disabled = false;
            rollDiceBtn.textContent = '주사위 굴리기';

        }, 1000);
    });
}

/* =========================================
   탭 및 브랜드 메뉴 스위칭 이벤트
========================================= */
searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        searchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.getAttribute('data-tab');
        
        if (currentTab === 'direct') {
            contentLayout.classList.remove('custom-mode');
            contentLayout.classList.add('direct-mode');
            renderRoomList(defaultRooms); 
        } else {
            contentLayout.classList.remove('direct-mode');
            contentLayout.classList.add('custom-mode');
            // 맞춤 탭 오면 주사위 초기화 및 대기 상태 보이기
            diceElements.forEach(d => { d.textContent = '⚀'; d.style.color='#222'; });
            roomCardsList.innerHTML = '<div style="text-align:center; padding: 50px 0; color:#666;">오른쪽의 주사위를 굴리면 맞춤 호실이 나타납니다.</div>';
            resultCountText.textContent = `검색 결과 (0)`;
        }
    });
});

brandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        brandBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBrand = btn.getAttribute('data-brand');
        
        if (currentTab === 'direct') {
            renderRoomList(defaultRooms);
        } else {
            // 맞춤 모드일 때 브랜드를 바꾸면 주사위를 새로 굴리도록 유도
            diceElements.forEach(d => { d.textContent = '⚀'; d.style.color='#222'; });
            roomCardsList.innerHTML = '<div style="text-align:center; padding: 50px 0; color:#666;">브랜드가 바뀌었습니다. 주사위를 다시 굴려주세요!</div>';
            resultCountText.textContent = `검색 결과 (0)`;
        }
    });
});

// 최초 실행
renderRoomList(defaultRooms);

/* =========================================
   🚨 수정: 예약하기 & 바로가기 버튼 엄격한 분리
========================================= */
roomCardsList.addEventListener('click', (e) => {
    const card = e.target.closest('.room-card');
    if (!card) return; // 카드가 아닌 곳을 클릭하면 무시

    if (e.target.classList.contains('btn-book')) {
        // 1. [예약하기] 버튼을 눌렀을 때만 브라우저에 저장
        const roomTitle = card.querySelector('h3').textContent;
        const roomAddress = card.querySelector('.room-details p').textContent.replace('주소', '').trim(); 
        
        localStorage.setItem('bookedTitle', roomTitle);
        localStorage.setItem('bookedAddress', roomAddress);
        
        alert(`[${roomTitle}] 예약이 완료되었습니다!\n이제 '바로가기' 버튼을 눌러 객실로 이동하세요.`);
    } 
    else if (e.target.classList.contains('btn-view')) {
        // 2. [바로가기] 버튼 클릭 시 무조건 내 호실로 이동 시도 
        // (예약 안 하고 눌렀을 때 쫓아내는 건 내 호실 페이지가 알아서 합니다)
        window.location.href = 'my-room.html';
    }
});