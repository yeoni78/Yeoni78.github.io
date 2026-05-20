// 헤더 요소를 가져옵니다.
const header = document.getElementById('main-header');

// 스크롤이 발생할 때마다 실행되는 함수
window.addEventListener('scroll', function() {
    // 스크롤 위치가 위에서 50px 이상 내려왔을 때
    if (window.scrollY > 50) {
        header.classList.add('scrolled'); // scrolled 클래스 추가 (검은색 배경)
    } else {
        // 스크롤이 맨 위로 올라갔을 때
        header.classList.remove('scrolled'); // scrolled 클래스 제거 (투명 배경)
    }
});