// 1. 조종할 헤더 요소를 HTML의 id 값을 이용해 찾아옵니다.
const header = document.getElementById('main-header');

// 2. 사용자가 마우스 스크롤을 움직일 때마다 안의 내용을 실행합니다.
window.addEventListener('scroll', () => {
    // 3. 현재 스크롤 위치가 화면 맨 위에서부터 50px 이상 내려왔는지 확인합니다.
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});