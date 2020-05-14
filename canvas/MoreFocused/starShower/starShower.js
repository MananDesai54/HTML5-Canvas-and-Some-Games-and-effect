let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext('2d');

window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;       
    init();
});
const background = context.createLinearGradient(0,0,0,canvas.height);
background.addColorStop(0,'#171e26');
background.addColorStop(1,'#3f586b');

function Star(x,y,radius,color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x:Math.random()*(4+4)-4,
        y:1
    }
    this.gravity = 1;
    this.friction = 0.7;
    this.frictionX = 0.9;

}
Star.prototype.draw = function() {
    context.save();
    context.fillStyle = this.color;
    context.shadowColor = '#e3eaef';
    context.shadowBlur = 20;
    context.beginPath();
    context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    context.fill();
    context.restore();
}
Star.prototype.update = function() {
    
    if(this.radius+this.y+this.velocity.y+groundHeight>canvas.height) {
        this.velocity.y = -this.velocity.y*this.friction;
        this.radius-=3;
        this.shatter();
    }else {
        this.velocity.y +=this.gravity;
    }
    if(this.radius+this.x>canvas.width || this.x-this.radius<0) {
        this.velocity.x = -this.velocity.x*this.frictionX;
        this.radius-=3;
        this.shatter();
    }
    this.y += this.velocity.y;
    this.x += this.velocity.x;
    if(this.radius>0) {
        this.draw();
    }
}
Star.prototype.shatter = function() {
    for(let i=0;i<8;i++) {
        const particle = new Particles(this.x,this.y,Math.random()*3+1,'#eee');
        particleArray.push(particle);
    }
}

let particleArray = [];
function Particles(x,y,radius,color) {
    Star.call(this,x,y,radius,color);
    this.velocity = {
        x:Math.random()*(5+5+1)-5,
        y:Math.random()*(15+15+1)-15
    }
    this.gravity = 0.1;
    this.friction = 0.8;
    this.time = 100;
    this.opacity = 1;
}
Particles.prototype.draw = function() {
    context.save();
    context.fillStyle = `rgba(227,234,239,${this.opacity})`;
    context.shadowColor = '#e3eaef';
    context.shadowBlur = 20;
    context.beginPath();
    context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    context.fill();
    context.restore();
}
Particles.prototype.update = function() {
    if(this.radius+this.y+this.velocity.y+groundHeight>canvas.height) {
        this.velocity.y = -this.velocity.y*this.friction;
    }else {
        this.velocity.y +=this.gravity;
    }
    if(this.radius+this.x>canvas.width || this.x-this.radius<0) {
        this.velocity.x = -this.velocity.x;
    }
    this.x += this.velocity.x
    this.y += this.velocity.y;
    this.opacity = this.opacity - 1/this.time;
    this.time-=1;
    this.draw()
}
function createMountain(numMountain,height,color) {
    for(let i=0;i<numMountain;i++) {
        const width = canvas.width/numMountain
        context.beginPath();
        context.moveTo(i*width,canvas.height);
        context.lineTo(i*width+width+500,canvas.height);
        context.lineTo(i*width + width/2,canvas.height-height);
        context.lineTo(i*width-500,canvas.height);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    }
}

let star,displayStar;
let starArray = [];
let displayStarArray = [];
let timer = 0;
let respanTime = 75;
let groundHeight = 70;
function init() {
    starArray = [];
    displayStarArray = [];  
    for(let i=0;i<150;i++){
        let radius =Math.random()*5;
        let x = Math.random()*canvas.width;
        let y = Math.random()*canvas.height;
        let color = '#e3eaef';
        displayStar = new Star(x,y,radius,color);
        displayStarArray.push(displayStar);
    }    
}
init();


function anime() {
    requestAnimationFrame(anime);
    timer++;
    context.fillStyle = background;
    context.fillRect(0,0,canvas.width,canvas.height);
    displayStarArray.forEach(star=>{
        star.draw();
    });
    createMountain(1,canvas.height-100,'#384551');
    createMountain(2,canvas.height-200,'#283843');
    createMountain(3,canvas.height-300,'#26333e');
    context.fillStyle = '#182028';
    context.fillRect(0,canvas.height-groundHeight,canvas.width,groundHeight);
    starArray.forEach((star,index)=>{
        star.update();
        if(star.radius<0) {
            starArray.splice(index,1);
        }
    })
    particleArray.forEach((particle,index)=>{
        particle.update();
        if(particle.time===0) {
            particleArray.splice(index,1);
        }
    });

    if(timer%respanTime===0) {
        let radius=15;
        let x = Math.random()*(canvas.width-2*radius)+radius;
        let color = '#eee';
        star = new Star(x,-100,radius,color);
        starArray.push(star);
        respanTime = Math.floor(Math.random()*(150-100)+100);
    }
}
anime();