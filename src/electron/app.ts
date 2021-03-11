import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

let win: BrowserWindow;

const DATA_DIR = path.join(__dirname, 'data');

function getNotes() {
  if (fs.existsSync(DATA_DIR)) {
    let files = fs.readdirSync(DATA_DIR, { withFileTypes: true },);
    let notes = files.map(file => `${file.name}`);
    win.webContents.send("getNotesResponse", notes);
  }
}

function deleteNote(note_name: string) {
  let file_name = path.join(DATA_DIR, note_name);
  if (fs.existsSync(file_name)) {
    fs.unlinkSync(file_name);
  }
}

function renameNote(existing_note: string, note_name: string) {
  let existing_file_name = path.join(DATA_DIR, existing_note);
  let file_name = path.join(DATA_DIR, note_name);
  
  if (fs.existsSync(existing_file_name)) {
    fs.renameSync(existing_file_name,file_name);
  }
}

function getData(note_name: string) {
  let file_name = path.join(DATA_DIR, note_name);
  if (fs.existsSync(file_name)) {
    try {
      const data = fs.readFileSync(file_name, 'utf-8');
      win.webContents.send("getNoteDataResponse", data);
    } catch (err) {
      console.error(err)
    }
  } else {
    win.webContents.send("getNoteDataResponse", null);
  }

}

function search(pattern:string){
  let files = fs.readdirSync(DATA_DIR, { withFileTypes: true },);
  let data:string[] = [];
  files.forEach( file =>{
    if( file.isFile ){
      let note_data = fs.readFileSync(path.join(DATA_DIR, file.name), 'utf-8');
      let matched = note_data.indexOf(pattern);
      if( matched >= 0 ){
        data.push(file.name)
      }
    }
  });
  win.webContents.send("searchResponse", data);
}

function createWindow() {

  win = new BrowserWindow(
    {
      "width": 800, "height": 600,
      "title": "My Life Notes...",
      "icon": path.join(__dirname, `./favicon.ico`),
      webPreferences: {
        "devTools": true,
        "nodeIntegration": true,
        "worldSafeExecuteJavaScript": true
      }
    }
  );
  //Removes the Menu bar
  win.removeMenu();

  win.loadURL(
    url.format({
      "pathname": path.join(__dirname, `./index.html`),
      "protocol": "file:",
      "slashes": true
    })
  );
  //Displays development tools
  //win.webContents.openDevTools();

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

ipcMain.on("loadNotes", (event) => {
  getNotes();
});

ipcMain.on("saveData", (event, note_name, note_data) => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  let file_name = path.join(DATA_DIR, note_name);

  fs.writeFile(file_name, JSON.stringify(note_data), 'utf-8', function (err) {
    if (err) return console.log(err);
  });
});

ipcMain.on("openNote", (event, note_name) => {
  getData(note_name);
});

ipcMain.on("deleteNote", (event, note_name) => {
  deleteNote(note_name);
});

ipcMain.on("renameNote", (event, note_names) => {
  renameNote(note_names[0], note_names[1]);
});

ipcMain.on("searchNotes", (event, pattern) => {
  search(pattern);
});