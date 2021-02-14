const request = require('request');
const path = require('path');
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron');


function createWindow() {
    const win = new BrowserWindow({
        width: 250,
        height: 80,
        resizable: false,
        fullscreen: false,
        title: "Tortudereli | Pentakill Music",
        icon: path.join(__dirname, "icon/icon.ico"),
        webPreferences: {
            nodeIntegration: true
        }
    })

    ipcMain.on("get", (event, arg) => {
        let options = {
            url: arg,
            strictSSL: false,
            headers: {
                'Accept': 'application/json'
            },
            json: true
        }
        request.get(options, (err, response, body) => {
            try {
                event.returnValue = {
                    "body": body,
                    "status": response.statusCode
                };
            } catch (error) {
                event.returnValue = {
                    "body": "",
                    "status": 404
                };
            }
        });
    });

    ipcMain.on("getCurrentVersion", (event) => {
        event.returnValue = 1.0;
    });

    win.loadFile(path.join(__dirname, 'src/index.html'))

    ipcMain.on('winClose', () => {
        app.quit();
    })
}
app.whenReady().then(createWindow)
Menu.setApplicationMenu(null);