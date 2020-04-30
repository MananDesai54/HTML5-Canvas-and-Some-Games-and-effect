let canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let c = canvas.getContext('2d')
console.log(c)

window.addEventListener('resize' , ()=> {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
})
window.addEventListener('mousemove' , ()=>{

})
function Circles(x , y ,radius,dx,dy,color) {
    this.x=x
    this.y=y
    this.radius=radius
    this.dx=dx
    this.dy=dy
    this.color=color

    this.draw = ()=>{
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.strokeStyle = this.color
        c.stroke()
    }

    this.update = (circles)=>{
        this.draw()
        for(let i=0;i<circles.length;i++) {
            if( circles[i]===this){
                continue
            }
            let dist = (Math.hypot((this.x-circles[i].x),(this.y-circles[i].y)))
            if(dist - 2*this.radius < 0) {
                this.dx = -this.dx
                this.dy = -this.dy
            }
        }
        if(this.x-this.radius<=0 || this.x+this.radius>=innerWidth) {
            this.dx = -this.dx
        }
        if(this.y-this.radius<=0 || this.y+this.radius>=innerHeight) { 
            this.dy = -this.dy
        }
        this.x+=this.dx
        this.y+=this.dy
    }
}
let colorArray = ['#197362',
                '#F29727',
                '#F2D7B6',
                '#BF622C',
                '#F24C27']
var circleArray = []
function init() {
    circleArray = []
    for(let i=0;i<4;i++){
        var radius = 100//Math.random()*30 + 1
        var x = Math.random() * (innerWidth-radius*2)+radius
        var y = Math.random() * (innerHeight-radius*2)+radius
        let dx = Math.random() * (3)
        let dy = Math.random() * (2)
        let color = colorArray[Math.floor(Math.random()*4)]

        if(i!==0){
            for(let j = 0;j<circleArray.length;j++){
                let dist = Math.hypot((x-circleArray[j].x),(y-circleArray[j].y))
                if(dist - 2*radius < 0){
                    x = Math.random() * (innerWidth-radius*2)+radius
                    y = Math.random() * (innerHeight-radius*2)+radius
                    j = -1
                }
            }
        }
        var circle = new Circles(x,y,radius,dx,dy,color)
        circleArray.push(circle)
    }
}

function graphics() {
    requestAnimationFrame(graphics)
    c.clearRect(0,0,window.innerWidth,window.innerHeight)
    circleArray.forEach(particles =>{
        particles.update(circleArray)
    })
}
//graphics()
init()