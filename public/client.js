const socket = io()

const canvas = document.getElementById("board")
const ctx = canvas.getContext("2d")

const SIZE = 100
const PIXEL = 10

canvas.width = SIZE * PIXEL
canvas.height = SIZE * PIXEL

let board = []
let owners = []

let selectedColor = "#000000"

function login() {

    const name = document.getElementById("username").value

    socket.emit("login", name)

}

socket.on("init", data => {

    board = data.board
    owners = data.owners

    draw()

})

function draw() {

    for (let y = 0; y < SIZE; y++) {

        for (let x = 0; x < SIZE; x++) {

            ctx.fillStyle = board[y][x]

            ctx.fillRect(
                x * PIXEL,
                y * PIXEL,
                PIXEL,
                PIXEL
            )

        }

    }

}

canvas.onclick = e => {

    const rect = canvas.getBoundingClientRect()

    const x = Math.floor((e.clientX - rect.left) / PIXEL)
    const y = Math.floor((e.clientY - rect.top) / PIXEL)

    socket.emit("placePixel", {
        x,
        y,
        color: selectedColor
    })

}

socket.on("updatePixel", data => {

    board[data.y][data.x] = data.color
    owners[data.y][data.x] = data.user

    ctx.fillStyle = data.color

    ctx.fillRect(
        data.x * PIXEL,
        data.y * PIXEL,
        PIXEL,
        PIXEL
    )

})

canvas.onmousemove = e => {

    const rect = canvas.getBoundingClientRect()

    const x = Math.floor((e.clientX - rect.left) / PIXEL)
    const y = Math.floor((e.clientY - rect.top) / PIXEL)

    socket.emit("getOwner", { x, y })

}

socket.on("owner", data => {

    document.getElementById("info").innerText =
        "pixel por: " + (data.user || "ninguém")

})

function toggleGrid() {

    document.body.classList.toggle("grid")

}

const colors = [
"#000000","#ffffff","#ff0000","#00ff00","#0000ff",
"#ffff00","#ff00ff","#00ffff",
"#ffa500","#800080","#008000","#808080",
"#ff69b4","#a52a2a","#add8e6","#ffd700"
]

const palette = document.getElementById("palette")
const currentColor = document.getElementById("currentColor")

currentColor.style.background = selectedColor

currentColor.onclick = () => {

    palette.classList.toggle("show")

}

colors.forEach(c => {

    const div = document.createElement("div")

    div.style.background = c

    div.onclick = () => {

        selectedColor = c
        currentColor.style.background = c

        palette.classList.remove("show")

    }

    palette.appendChild(div)

})