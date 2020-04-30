let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext('2d');

window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;       
    init();
});

let colorArray = [
    '#6994d5',
    '#ff8033',
    '#e53c68',
    '#4cc7ba',
    '#006d99'
]

let mouse = {
    x:null,
    y:null
}




window.addEventListener('mousemove',(e)=>{
    mouse.x = e.x;
    mouse.y = e.y;
});

function Circle(x,y,dx,dy,radius,color) {
    this.x = x;
    this.y = y;
    this.dx= dx;
    this.dy = dy;
    this.radius = radius;
    this.defaultRadius = radius;
    this.maxRadius = 50;
    this.color = color;

    this.draw = function() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.fill();
    }
    this.update = function() {

        if(this.x+this.radius>window.innerWidth || this.x-this.radius<0) {
            this.dx = -this.dx;
        }
        if(this.y+this.radius>window.innerHeight || this.y-this.radius<0) {
            this.dy = -this.dy;
        }
        if(mouse.x-this.x<50 && mouse.x-this.x>-50&&mouse.y-this.y<50 && mouse.y-this.y>-50&&this.radius<this.maxRadius&&this.x-this.radius>0&&this.radius+this.x<window.innerWidth&&this.y-this.radius>0&&this.y+this.radius<window.innerHeight) {
            this.radius+=1;
        }
        
        else if(this.radius>this.defaultRadius) {
            this.radius-=1;
        }
        
        this.x+=this.dx;
        this.y+=this.dy;
        this.draw();
    }
}


let circle;
let circleArray = [];

function init() {
    circleArray = [];
    for(let i=0;i<200;i++){
        let radius = Math.random()*10 + 1;
        let x = Math.random()*(window.innerWidth-radius*2)+radius;
        let dx = Math.random() - 0.5;
        let y = Math.random()*(window.innerHeight-radius*2)+radius;
        let dy = Math.random() - 0.5;
        let color = colorArray[Math.floor(Math.random()*colorArray.length)];
        circle = new Circle(x,y,dx,dy,radius,color);
        circleArray.push(circle);
    }    
}
init();


function anime() {
    context.clearRect(0,0,window.innerWidth,window.innerHeight);
    circleArray.forEach(circle=>{
        circle.update();
    })

    requestAnimationFrame(anime);
}
anime();

// window.addEventListener('keydown',(e)=>{
//     anime();
// })
// window.addEventListener('keyup',()=>{
//     console.log('Hello');
// })