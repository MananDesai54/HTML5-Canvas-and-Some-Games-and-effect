let canvas = document.querySelector('canvas')
canvas.height = window.innerHeight
canvas.width = window.innerWidth

var c = canvas.getContext('2d')
console.log(c)

var mouse = {
    x : 10,
    y : 10
}
window.addEventListener('resize' , ()=> {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    init()
})
addEventListener('mousemove' , (event)=>{
    mouse.x = event.clientX
    mouse.y = event.clientY
})
function getHypo(x1,y1,x2,y2) {
    let distX = x1-x2
    let distY = y1-y2
    return Math.hypot(distX,distY)
}
function Circle(x,y,radius,color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color

    this.draw = function() {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
    this.update = function() {
        
        let distance = getHypo(circle1.x,circle1.y,circle2.x,circle2.y)
        if (distance <= circle1.radius + circle2.radius) {
            circle1.color = 'black'            
        }else {
            circle1.color = 'red'
        }
        this.draw()
    }
}
var circle1,circle2
function init() {
    circle1 = new Circle(innerWidth/2,innerHeight/2,50,'red')
    circle2 = new Circle(mouse.x,mouse.y,20,'black')
}
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth,innerHeight)
    //c.fillText('Manan Desai' , mouse.x , mouse.y)
    circle1.update()
    circle2.x = mouse.x
    circle2.y = mouse.y
    circle2.update()
}
init()
animate()