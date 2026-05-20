/* =========================================
   [메인 전용] 메인 배너 슬라이더 
========================================= */
const sliderWrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slide');

// 커스텀 컨트롤러 요소들 찾기
const fractionText = document.querySelector('.slide-fraction');
const progressBarFill = document.querySelector('.progress-bar-fill');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const pauseBtn = document.querySelector('.pause-btn');

let currentSlideIndex = 0;
const slideCount = slides.length;
const slideInterval = 5000; // 5초
let autoSlide;
let isPlaying = true;

// 1. 화면에 나오는 숫자와 하얀색 진행 선의 길이를 업데이트하는 함수
function updateControls() {
    // 예: 1 / 3 으로 표시
    fractionText.innerHTML = `<strong>${currentSlideIndex + 1}</strong> / ${slideCount}`;
    // 선 길이 계산 (1번이면 33%, 2번이면 66%...)
    const fillWidth = ((currentSlideIndex + 1) / slideCount) * 100;
    progressBarFill.style.width = `${fillWidth}%`;
}

// 2. 슬라이드를 넘기는 핵심 함수
function changeSlide(index) {
    if (index < 0) {
        currentSlideIndex = slideCount - 1;
    } else if (index >= slideCount) {
        currentSlideIndex = 0;
    } else {
        currentSlideIndex = index;
    }
    
    sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    updateControls(); // 넘길 때마다 숫자와 선도 업데이트
}

// 3. 자동 슬라이드 시작 함수
function startSlide() {
    autoSlide = setInterval(() => {
        changeSlide(currentSlideIndex + 1);
    }, slideInterval);
    isPlaying = true;
    pauseBtn.textContent = '||'; // 멈춤 아이콘
}

// 4. 자동 슬라이드 멈춤 함수
function stopSlide() {
    clearInterval(autoSlide);
    isPlaying = false;
    pauseBtn.textContent = '▶'; // 재생 아이콘
}

// =========================================
// 버튼 클릭 이벤트 달기
// =========================================

// 이전 버튼(<)
prevBtn.addEventListener('click', () => {
    changeSlide(currentSlideIndex - 1);
    if (isPlaying) { stopSlide(); startSlide(); } // 타이머 초기화를 위해 껐다 켬
});

// 다음 버튼(>)
nextBtn.addEventListener('click', () => {
    changeSlide(currentSlideIndex + 1);
    if (isPlaying) { stopSlide(); startSlide(); }
});

// 일시정지/재생 버튼(||, ▶)
pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopSlide();
    } else {
        startSlide();
    }
});

// 사이트 처음 켜졌을 때 초기화 및 실행
updateControls();
startSlide();

