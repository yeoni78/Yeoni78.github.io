/* =========================================
   [호텔 이용 수칙] 방탈출 미니게임 (점수 2배속 패치판)
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    const isHorrorMode = localStorage.getItem('horrorMode');
    const pageTitle = document.getElementById('rules-title');
    const pageSub = document.getElementById('rules-sub');
    const gameScreen = document.getElementById('game-screen');

    // =========================================
    // 🎨 [이미지 에셋 준비 구역]
    // =========================================
    const sprites = {
        dino: new Image(),       
        dinoDuck: new Image(),   
        bunny: new Image(),      
        cactus: new Image(),     
        bat: new Image(),        
        bird: new Image(),       
        pipeTop: new Image(),    
        pipeBottom: new Image()  
    };

    if (isHorrorMode === 'true') {
        if (pageTitle) pageTitle.textContent = "버니와 술래잡기";
        if (pageSub) pageSub.textContent = "버니를 피해 탈출하세요.";
        
        if (gameScreen) {
            gameScreen.innerHTML = `
                <div id="start-trigger" style="text-align:center; cursor:pointer; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center;">
                    <h3 style="margin-bottom: 20px; font-size:1.8rem; color:#ff0000; text-shadow:0 0 10px red;">방문이 굳게 잠겨있습니다.</h3>
                    <p style="color:#ff0000; font-size:1.5rem; font-weight:bold; text-decoration:underline; animation: blink 1.5s infinite;">[ 탈출하기 ]</p>
                </div>
            `;
            document.getElementById('start-trigger').addEventListener('click', initGame);
        }
    } else {
        if (gameScreen) {
            gameScreen.innerHTML = `
                <div style="text-align:center;">
                    <h3 style="margin-bottom: 15px;">안전하고 편안한 투숙을 위해</h3>
                    <p style="font-size:1rem;">호텔 내 규정을 반드시 준수해 주시길 바랍니다.</p>
                </div>
            `;
        }
    }

    // =========================================
    // 🎮 미니게임 엔진 로직
    // =========================================
    function initGame() {
        gameScreen.innerHTML = '<canvas id="game-canvas" width="800" height="400"></canvas>';
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        const STATE = { INTRO: 0, ROUND1: 1, ROUND2_TRANS: 2, ROUND2: 3, ESCAPE: 4, GAMEOVER: 5, CLEAR: 6 };
        let currentState = STATE.ROUND1;
        let frames = 0;
        let animationId;

        // ---------------------------------
        // [1라운드] 다이노 물리 변수
        // ---------------------------------
        let dino = { x: 150, y: 300, w: 44, h: 47, dy: 0, gravity: 0.3, jumpPower: -8.5, isGrounded: false, isDucking: false };
        let bunny = { x: -100, y: 280, w: 60, h: 60 }; 
        let obstacles = []; 
        let scoreR1 = 0;
        let groundY = 340;
        let gameSpeed = 4.5; 

        // ---------------------------------
        // [2라운드] 플래피 버드 물리 변수
        // ---------------------------------
        let bird = { x: 200, y: 200, w: 34, h: 24, dy: 0, gravity: 0.15, jumpPower: -4.8 };
        let pipes = [];
        let scoreR2 = 0;

        function drawSprite(img, obj, fallbackColor) {
            if (img.src) {
                ctx.drawImage(img, obj.x, obj.y, obj.w, obj.h);
            } else {
                ctx.fillStyle = fallbackColor;
                ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
            }
        }

        // ---------------------------------
        // 🎮 조작 로직
        // ---------------------------------
        function jump() {
            if (currentState === STATE.ROUND1 && dino.isGrounded && !dino.isDucking) {
                dino.dy = dino.jumpPower;
                dino.isGrounded = false;
            } else if (currentState === STATE.ROUND2) {
                bird.dy = bird.jumpPower;
            } else if (currentState === STATE.GAMEOVER) {
                resetGame();
            }
        }

        window.addEventListener('keydown', (e) => { 
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                jump(); 
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                if (currentState === STATE.ROUND1) {
                    dino.isDucking = true;
                    if (!dino.isGrounded) dino.dy += 2.5; 
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                if (currentState === STATE.ROUND1) {
                    dino.isDucking = false;
                }
            }
        });

        canvas.addEventListener('contextmenu', e => e.preventDefault());

        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) jump();
            else if (e.button === 2) { 
                if (currentState === STATE.ROUND1) {
                    dino.isDucking = true;
                    if (!dino.isGrounded) dino.dy += 2.5; 
                }
            }
        });

        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 2) { 
                if (currentState === STATE.ROUND1) dino.isDucking = false;
            }
        });

        function isCollision(rect1, rect2) {
            const margin = 5; 
            return rect1.x + margin < rect2.x + rect2.w - margin &&
                   rect1.x + rect1.w - margin > rect2.x + margin &&
                   rect1.y + margin < rect2.y + rect2.h - margin &&
                   rect1.y + rect1.h - margin > rect2.y + margin;
        }

        function resetGame() {
            if (scoreR1 < 4444) {
                currentState = STATE.ROUND1;
                dino.y = 300; dino.dy = 0; dino.isDucking = false;
                bunny.x = -100;
                obstacles = []; scoreR1 = 0; frames = 0; gameSpeed = 4.5;
            } else {
                currentState = STATE.ROUND2;
                bird.y = 200; bird.dy = 0;
                bunny.x = -100; 
                bunny.y = 200;
                pipes = []; scoreR2 = 0; frames = 0;
            }
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frames++;

            // ==========================================
            // [라운드 1: 버니 추격전]
            // ==========================================
            if (currentState === STATE.ROUND1) {
                if (dino.isDucking) {
                    dino.w = 60;
                    dino.h = 25;
                } else {
                    dino.w = 44;
                    dino.h = 47;
                }

                dino.dy += dino.gravity;
                dino.y += dino.dy;

                if (dino.y + dino.h >= groundY) {
                    dino.y = groundY - dino.h;
                    dino.dy = 0;
                    dino.isGrounded = true;
                }

                // 🚨 점수 증가 속도 2배 (프레임당 2점씩 상승)
                scoreR1 += 2;
                
                if (scoreR1 % 400 === 0 && gameSpeed < 7.5) gameSpeed += 0.4; 

                if (scoreR1 >= 4444) {
                    currentState = STATE.ROUND2_TRANS;
                    frames = 0;
                }

                let spawnInterval = Math.max(110, 180 - Math.floor(gameSpeed * 5));
                if (frames % spawnInterval === 0) {
                    let type = Math.random();
                    let isFlying = scoreR1 > 150 && type > 0.70; 
                    
                    let obsW, obsH, obsY;
                    let renderY, renderH; 

                    if (isFlying) {
                        obsW = 34; 
                        obsY = groundY - 30 - 1000; 
                        obsH = 1000; 
                        renderY = groundY - 60; 
                        renderH = 25;
                    } else {
                        obsW = type > 0.4 ? 40 : 25; 
                        obsH = type > 0.5 ? 45 : 35;
                        obsY = groundY - obsH;
                        renderY = obsY;
                        renderH = obsH;
                    }
                    obstacles.push({ x: canvas.width, y: obsY, w: obsW, h: obsH, renderY: renderY, renderH: renderH, isFlying: isFlying });
                }

                ctx.fillStyle = '#220000';
                ctx.fillRect(0, groundY, canvas.width, 2);

                for (let i = 0; i < obstacles.length; i++) {
                    let obs = obstacles[i];
                    obs.x -= gameSpeed;
                    
                    let renderObj = { x: obs.x, y: obs.renderY, w: obs.w, h: obs.renderH };
                    
                    if (obs.isFlying) {
                        drawSprite(sprites.bat, renderObj, '#4b0082'); 
                    } else {
                        drawSprite(sprites.cactus, renderObj, '#8b0000');
                    }

                    if (isCollision(dino, obs)) currentState = STATE.GAMEOVER;
                }
                obstacles = obstacles.filter(obs => obs.x + obs.w > 0);

                if (dino.isDucking) {
                    drawSprite(sprites.dinoDuck, dino, '#999999'); 
                } else {
                    drawSprite(sprites.dino, dino, '#cccccc'); 
                }
                
                if (bunny.x < 30) bunny.x += 0.15; 
                bunny.y = groundY - bunny.h - Math.abs(Math.sin(frames * 0.1) * 10);
                drawSprite(sprites.bunny, bunny, '#ffffff');

                ctx.fillStyle = 'white';
                ctx.font = '20px "Courier New", monospace';
                ctx.fillText(`SCORE: ${scoreR1} / 4444`, 570, 40);
            }

            // ==========================================
            // [라운드 2 전환 대기]
            // ==========================================
            else if (currentState === STATE.ROUND2_TRANS) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '30px "Courier New", monospace';
                ctx.textAlign = 'center';
                ctx.fillText("바닥이 무너집니다...!", canvas.width/2, canvas.height/2);
                ctx.font = '20px "Courier New", monospace';
                ctx.fillText("스페이스바나 화면을 연타해 날아오르세요!", canvas.width/2, canvas.height/2 + 40);
                
                if (frames > 150) { 
                    currentState = STATE.ROUND2;
                    bird.dy = -5; 
                    bunny.x = -100; 
                    bunny.y = bird.y;
                    ctx.textAlign = 'left'; 
                }
            }

            // ==========================================
            // [라운드 2: 플래피 버드 & 공중 추격전]
            // ==========================================
            else if (currentState === STATE.ROUND2) {
                bird.dy += bird.gravity;
                bird.y += bird.dy;

                if (bird.y < 0 || bird.y + bird.h > canvas.height) currentState = STATE.GAMEOVER;

                if (frames % 100 === 0) {
                    let gap = 190; 
                    let topHeight = Math.random() * (canvas.height - gap - 100) + 50;
                    pipes.push({ x: canvas.width, y: 0, w: 50, h: topHeight, passed: false, isTop: true }); 
                    pipes.push({ x: canvas.width, y: topHeight + gap, w: 50, h: canvas.height - topHeight - gap, passed: false, isTop: false }); 
                }

                for (let i = 0; i < pipes.length; i++) {
                    let p = pipes[i];
                    p.x -= 3; 
                    
                    if (p.isTop) drawSprite(sprites.pipeTop, p, '#4a0000');
                    else drawSprite(sprites.pipeBottom, p, '#4a0000');

                    if (isCollision(bird, p)) currentState = STATE.GAMEOVER;

                    if (p.isTop && !p.passed && bird.x > p.x + p.w) {
                        scoreR2++;
                        p.passed = true;
                        
                        if(scoreR2 >= 44) currentState = STATE.ESCAPE;
                    }
                }
                pipes = pipes.filter(p => p.x + p.w > 0);

                if (bunny.x < 30) bunny.x += 1;
                bunny.y += (bird.y - bunny.y) * 0.08; 
                drawSprite(sprites.bunny, bunny, '#ffffff');

                ctx.save();
                ctx.translate(bird.x + bird.w/2, bird.y + bird.h/2);
                let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.dy * 0.1)));
                ctx.rotate(rotation);
                let rotatedBird = { x: -bird.w/2, y: -bird.h/2, w: bird.w, h: bird.h };
                drawSprite(sprites.bird, rotatedBird, '#ffcc00');
                ctx.restore();

                ctx.fillStyle = 'white';
                ctx.font = '20px "Courier New", monospace';
                ctx.fillText(`ROUND 2 SCORE: ${scoreR2} / 44`, 550, 40);
            }

            // ==========================================
            // [탈출 연출 컷신]
            // ==========================================
            else if (currentState === STATE.ESCAPE) {
                for (let i = 0; i < pipes.length; i++) {
                    let p = pipes[i];
                    p.x -= 3; 
                    if (p.isTop) drawSprite(sprites.pipeTop, p, '#4a0000');
                    else drawSprite(sprites.pipeBottom, p, '#4a0000');
                }

                bird.x += 4; 
                bird.y += (canvas.height / 2 - bird.y) * 0.05; 
                bunny.y += 2;
                
                drawSprite(sprites.bunny, bunny, '#ffffff');
                drawSprite(sprites.bird, bird, '#ffcc00');
                
                if (bird.x > canvas.width + 50) {
                    currentState = STATE.CLEAR;
                }
            }

            // ==========================================
            // [게임 오버]
            // ==========================================
            else if (currentState === STATE.GAMEOVER) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'red';
                ctx.font = 'bold 40px "Courier New", monospace';
                ctx.textAlign = 'center';
                ctx.fillText("YOU DIED", canvas.width/2, canvas.height/2 - 20);
                ctx.fillStyle = 'white';
                ctx.font = '20px "Courier New", monospace';
                ctx.fillText("화면을 클릭하거나 스페이스바를 눌러 재도전", canvas.width/2, canvas.height/2 + 30);
                ctx.textAlign = 'left';
            }
            
           // 🚨 [최종 클리어 & 강제 초기화 엔딩 연출] (이 부분만 교체하세요!)
            else if (currentState === STATE.CLEAR) {
                ctx.fillStyle = '#050505';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 50px "궁서", "Gungsuh", serif';
                ctx.textAlign = 'center';
                ctx.fillText("아쉽네, 잘가", canvas.width/2, canvas.height/2 + 15);
                ctx.textAlign = 'left';

                document.body.classList.add('ending-glitch');
                
                setTimeout(() => {
                    localStorage.setItem('endGameLock', 'true'); // 잠금 상태 활성화
                    window.location.href = 'login.html';         // 로그인 페이지로 이동
                }, 2500); 

                return; // 🚨 루프 정지
            }

            animationId = requestAnimationFrame(gameLoop);
        }

        gameLoop();
    }
});