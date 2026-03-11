const canvas = document.getElementById("board")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const PIXEL = 10

/* TAMANHO DO CANVAS */

const BOARD_WIDTH = 200
const BOARD_HEIGHT = 200

let pixels = {}

let mouseX = 0
let mouseY = 0

let zoom = 1
let offsetX = 0
let offsetY = 0

let dragging = false
let dragStartX = 0
let dragStartY = 0

let mode = "paint"

let currentColor = "#000000"

let grid = true

/* sons */

const placeSound = new Audio("place.wav")
const buttonSound = new Audio("buttonselect.wav")

/* cooldown */

let cooldown = false
let cooldownTime = 60

const placeButton = document.getElementById("placeButton")

function startCooldown(){

cooldown = true

placeButton.style.background = "#bfbfbf"

let time = cooldownTime

const timer = setInterval(()=>{

time--

let m = Math.floor(time/60).toString().padStart(2,"0")
let s = (time%60).toString().padStart(2,"0")

placeButton.innerText = `${m}:${s}`

if(time <= 0){

clearInterval(timer)

cooldown = false

placeButton.innerText = "Colocar"
placeButton.style.background = "#6fcf97"

}

},1000)

}

/* botões */

document.getElementById("paint").onclick=()=>{
mode="paint"
buttonSound.play()
}

document.getElementById("move").onclick=()=>{
mode="move"
buttonSound.play()
}

document.getElementById("gridBtn").onclick=()=>{
grid=!grid
buttonSound.play()
}

/* créditos */

const creditsBtn = document.getElementById("creditsBtn")
const creditsPanel = document.getElementById("credits")

creditsBtn.onclick=()=>{

buttonSound.play()
creditsPanel.classList.toggle("open")

}

/* paleta */

const palette=[
"#000000","#ffffff","#ff0000","#00ff00","#0000ff",
"#ffff00","#ff00ff","#00ffff","#ff8800","#888888"
]

const colorsPanel=document.getElementById("colors")

palette.forEach(c=>{

const div=document.createElement("div")
div.className="color"
div.style.background=c

div.onclick=()=>{

currentColor=c
buttonSound.play()

}

colorsPanel.appendChild(div)

})

document.getElementById("colorsBtn").onclick=()=>{
colorsPanel.classList.toggle("open")
buttonSound.play()
}

/* mouse */

canvas.addEventListener("mousedown",e=>{

if(mode==="move"){

dragging=true
dragStartX=e.clientX-offsetX
dragStartY=e.clientY-offsetY

}

if(mode==="paint"){

placePixel()

}

})

canvas.addEventListener("mouseup",()=>{

dragging=false

})

canvas.addEventListener("mousemove",e=>{

const rect=canvas.getBoundingClientRect()

const x=(e.clientX-rect.left-offsetX)/zoom
const y=(e.clientY-rect.top-offsetY)/zoom

mouseX=Math.floor(x/PIXEL)
mouseY=Math.floor(y/PIXEL)

if(dragging){

offsetX=e.clientX-dragStartX
offsetY=e.clientY-dragStartY

}

})

/* zoom */

canvas.addEventListener("wheel",e=>{

e.preventDefault()

const zoomAmount=0.1

if(e.deltaY<0){
zoom+=zoomAmount
}else{
zoom-=zoomAmount
}

zoom=Math.max(0.5,Math.min(zoom,4))

})

/* colocar pixel */

function placePixel(){

if(cooldown) return

if(mouseX < 0 || mouseY < 0) return
if(mouseX >= BOARD_WIDTH || mouseY >= BOARD_HEIGHT) return

pixels[mouseX+","+mouseY]=currentColor

placeSound.currentTime=0
placeSound.play()

startCooldown()

}

/* desenho */

function draw(){

ctx.setTransform(1,0,0,1,0,0)

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.translate(offsetX,offsetY)
ctx.scale(zoom,zoom)

/* grid */

if(grid){

ctx.strokeStyle="#e6e6e6"

for(let x=0;x<BOARD_WIDTH;x++){
for(let y=0;y<BOARD_HEIGHT;y++){

ctx.strokeRect(x*PIXEL,y*PIXEL,PIXEL,PIXEL)

}
}

}

/* pixels */

for(const key in pixels){

const [x,y]=key.split(",")

ctx.fillStyle=pixels[key]

ctx.fillRect(x*PIXEL,y*PIXEL,PIXEL,PIXEL)

}

/* cursor */

ctx.fillStyle="rgba(0,0,0,0.25)"
ctx.fillRect(mouseX*PIXEL,mouseY*PIXEL,PIXEL,PIXEL)

/* borda */

ctx.strokeStyle="#888"
ctx.lineWidth=4
ctx.strokeRect(0,0,BOARD_WIDTH*PIXEL,BOARD_HEIGHT*PIXEL)

requestAnimationFrame(draw)

}

draw()