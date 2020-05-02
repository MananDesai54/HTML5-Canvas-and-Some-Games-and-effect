let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;
let { innerWidth , innerHeight } = window;
canvas.style.background = '#1a2b3c';
let score = 0;
let brickRow = 5;
let brickColumn = 9;
let container = document.querySelector('.container');
let text = document.querySelector('h1');
let playAg = document.querySelector('button');
let request,break1=false;

let context = canvas.getContext('2d');

window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    drawEverything();
});

//ball

let ball = {
    x:innerWidth/2,
    y:innerHeight-30,
    radius:10,
    dx:4,
    dy:-4,
    speed:4,
}

function drawBall() {
    context.beginPath();
    context.fillStyle = '#eee';
    context.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,false);
    context.fill();
    context.closePath();
}

//paddle

let paddle = {
    x:innerWidth/2-40,
    y:innerHeight-20,
    height:10,
    width:80,
    dx:0,
    speed:8
}

function drawPaddle() {
    context.beginPath();
    context.fillStyle = 'orange';
    context.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    context.closePath();
}

//Score
function drawText() {
    if(score===brickRow*brickColumn) {
        score=0;
        container.style.zIndex = '2';
        container.style.opacity = '1';
        text.textContent = 'You Lose';
        break1 = true;
        ball.x=innerWidth/2;
        ball.y=innerHeight-30;
        paddle.x =  innerWidth/2-40;
        paddle.y = innerHeight-20;
    }
    context.font = '20px Verdana';
    context.fillText(`Score : ${score}`,innerWidth-120,30)
}

//bricks
let brick = {
    width:70,
    height:20,
    paddingX:40,
    paddingY:20,
    offsetX:150,
    offsetY:100,
    visible:true
}
let bricks = [];

function createBrick() {
    for(let i=0;i<5;i++) {
        bricks[i] = [];
        for(let j=0;j<9;j++) {
            const x = i*(brick.width+brick.paddingX)+brick.offsetX;
            const y = j*(brick.height+brick.paddingY)+brick.offsetY;
            bricks[i][j] = {x,y,...brick};
        }
    }
}
createBrick();
function drwaBrick() {
    bricks.forEach(column=>{
        column.forEach(brick=>{
            context.beginPath();
            context.fillStyle = brick.visible?'orange':'transparent';
            context.fillRect(brick.x,brick.y,brick.width,brick.height);
            context.closePath();
        })
    })
}


function drawEverything() {
    context.clearRect(0,0,innerWidth,innerHeight);
    drawPaddle();
    drawText();
    drawBall();
    drwaBrick();
}
drawEverything();


function animate() {
    if(break1) {
        return;
    }
    movePaddle();
    breakBrick();
    moveBall();
    drawEverything();
    request = requestAnimationFrame(animate);
}
animate();

function moveBall() {
    ball.x+=ball.dx;
    ball.y+=ball.dy;
    if(ball.x-ball.radius<0 || ball.x+ball.radius>innerWidth) {
        ball.dx*=-1;
    }
    if(ball.y-ball.radius<0 || ball.y+ball.radius>innerHeight) {
        ball.dy*=-1;
    }
    if(ball.x-ball.radius>paddle.x-ball.radius && ball.x+ball.radius<paddle.x+paddle.width+ball.radius && ball.y+ball.radius>paddle.y) {
        ball.dy*=-1;
    }else if(ball.y+ball.radius>paddle.y){
        container.style.zIndex = '2';
        container.style.opacity = '1';
        text.textContent = 'You Lose';
        break1 = true;
        ball.x=innerWidth/2;
        ball.y=innerHeight-30;
        paddle.x =  innerWidth/2-40;
        paddle.y = innerHeight-20;
        score = 0;
    }
}
playAg.addEventListener('click',()=>{
    createBrick();
    container.style.zIndex = '-1';
    container.style.opacity = '0';
    break1 = false;
    animate();
})

function breakBrick() {
    bricks.forEach(column=>{
        column.forEach(brick=>{
            if(brick.visible && ball.x-ball.radius>brick.x-ball.radius && //left
               ball.x+ball.radius<brick.x+brick.width+ball.radius &&//right
               ball.y-ball.radius<brick.y+brick.height && //bottom 
               ball.y+ball.radius>brick.y //top
            ) {
                brick.visible = false;
                ball.dy*=-1;
                score++;
            }
        })
    })
}

function movePaddle() {
    paddle.x+=paddle.dx;
    if(paddle.x<0) {
        paddle.x = 0;
    }else if(paddle.x+paddle.width>innerWidth) {
        paddle.x = innerWidth-paddle.width;
    }
}

window.addEventListener('keydown',(e)=>{
    if(e.keyCode===37) {
        paddle.dx = -paddle.speed;
    }else if(e.keyCode===39) {
        paddle.dx = paddle.speed;
    }
});

window.addEventListener('keyup',(e)=>{
    if(e.keyCode===37 || e.keyCode) {
        paddle.dx = 0;
    }
});