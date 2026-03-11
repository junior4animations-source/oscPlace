const express = require("express")
const http = require("http")
const {Server} = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let pixels = {}

io.on("connection",(socket)=>{

socket.emit("loadPixels",pixels)

socket.on("placePixel",(data)=>{

pixels[data.pos]=data.color

io.emit("pixelPlaced",data)

})

})

server.listen(process.env.PORT || 3000)
console.log("Servidor rodando")

})
