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