/* =========================================
   [호텔 이용 수칙] 방탈출 게임 메인 로직
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // 유저가 호러 모드(방탈출 상태)인지 확인
    const isHorrorMode = localStorage.getItem('horrorMode');
    
    const pageTitle = document.getElementById('rules-title');
    const pageSub = document.getElementById('rules-sub');
    const gameScreen = document.getElementById('game-screen');

    if (isHorrorMode === 'true') {
        // =========================================
        // 🚨 방탈출 게임 상태
        // =========================================
        console.log("괴담 모드 활성화: 방탈출 게임 준비 완료");
        
        // 🚨 요청하신 타이틀과 서브 텍스트로 변경
        if (pageTitle) pageTitle.textContent = "버니와 술래잡기";
        if (pageSub) pageSub.textContent = "버니를 피해 탈출하세요";
        
        if (gameScreen) {
            gameScreen.innerHTML = `
                <div style="text-align:center;">
                    <h3 style="margin-bottom: 20px; font-size:1.5rem; color:#ff0000;">방문이 굳게 잠겨있습니다.</h3>
                    <p style="color:#a80000;">게임을 시작하려면 단서를 클릭하세요.</p>
                </div>
            `;
        }
    } else {
        // =========================================
        // 평범한 상태 (아직 숙박하기를 안 누름)
        // =========================================
        if (gameScreen) {
            gameScreen.innerHTML = `
                <div style="text-align:center;">
                    <h3 style="margin-bottom: 15px;">안전하고 편안한 투숙을 위해</h3>
                    <p style="font-size:1rem;">호텔 내 규정을 반드시 준수해 주시길 바랍니다.</p>
                </div>
            `;
        }
    }
});