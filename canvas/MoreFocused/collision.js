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
    this.velocity = {
        x : dx,
        y : dy
    }
    this.radius = radius;
    this.defaultRadius = radius;
    this.maxRadius = 50;
    this.color = color;
    this.mass = 1;
    this.opacity = 0;

    this.draw = function() {
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.color;
        context.fill();
        context.restore();
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();
    }
    this.update = function() {

        for(let i=0;i<circleArray.length;i++) {
            if(this===circleArray[i]) {
                continue;
            }
            if(getDistance(this.x,this.y,circleArray[i].x,circleArray[i].y) - 2*this.radius < 0) {
                resolveCollision(this,circleArray[i]);
            }
        }

        if(this.x+this.radius>window.innerWidth || this.x-this.radius<0) {
            this.velocity.x = -this.velocity.x;
        }
        if(this.y+this.radius>window.innerHeight || this.y-this.radius<0) {
            this.velocity.y = -this.velocity.y;
        }
        if(getDistance(mouse.x,mouse.y,this.x,this.y) < 100) {
            this.opacity += 0.02;
        }else if(this.opacity>0) {
            this.opacity -= Math.max(0,this.opacity);
        }
        //else {
        //     this.opacity -= 0.02
        // }
        
        
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
        this.draw();
    }
}

function getDistance(x1,y1,x2,y2) {
    return Math.hypot(x2-x1,y2-y1);
}


function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}



function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

let circle;
let circleArray = [];

function init() {
    circleArray = [];
    for(let i=0;i<150;i++){
        let radius = 20;
        let x = Math.random()*(window.innerWidth-radius*2)+radius;
        let dx = Math.random() - 0.5;
        let y = Math.random()*(window.innerHeight-radius*2)+radius;
        let dy = Math.random() - 0.5;
        let color = colorArray[Math.floor(Math.random()*colorArray.length)];
        if(i!==0) {
            for(let j=0;j<circleArray.length;j++) {
                if(getDistance(x,y,circleArray[j].x,circleArray[j].y)-2*radius<0) {
                    x = Math.random()*(window.innerWidth-radius*2)+radius;
                    y = Math.random()*(window.innerHeight-radius*2)+radius;

                    j = -1;
                }
            }
        }
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
