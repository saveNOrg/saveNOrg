import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

let win: BrowserWindow;
const DATA_DIR = path.join(__dirname, 'data' );
function createWindow() {
  win = new BrowserWindow({ "width": 800, "height": 600,
    "title": "My Life Notes...",
    "icon": path.join(__dirname,`./favicon.ico`),
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true
    } });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `./index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

function getNotes() {
  if ( fs.existsSync( DATA_DIR ) ){
    let files = fs.readdirSync(DATA_DIR, {withFileTypes: true}, );
    let notes = files.map(file => `${file.name}`);
    win.webContents.send("getNotesResponse", notes);  
  }
}

ipcMain.on("loadNotes", (event) => {
  getNotes();
});

ipcMain.on("saveData", (event, note_name, note_data) => {
  console.log("note_name ", note_name);
  console.log("note_data ", note_data);
  if (!fs.existsSync( DATA_DIR )){
    fs.mkdirSync( DATA_DIR );
  }
  
  let file_name = path.join(DATA_DIR, note_name );

  fs.writeFile(file_name, JSON.stringify(note_data),  'utf-8', function (err) {
    if (err) return console.log(err);
    console.log(note_data +' > '+ file_name);
  });
});

ipcMain.on("openNotes", (event, note_name) => {
  getData(note_name);
});

function getData(note_name:string) {

  let file_name = path.join(DATA_DIR, note_name );
  if (fs.existsSync( file_name )){
    try {
      const data = fs.readFileSync(file_name,'utf-8');
      win.webContents.send("getNoteDataResponse", data);
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }

}