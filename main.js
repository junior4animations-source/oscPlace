const { app, BrowserWindow, Menu } = require("electron")
const path = require("path")

function createWindow(){

const win = new BrowserWindow({
width:1200,
height:800,
icon:path.join(__dirname,"icon.png")
})

Menu.setApplicationMenu(null)

win.loadFile("index.html")

}

app.whenReady().then(createWindow)