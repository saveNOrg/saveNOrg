import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import * as os from './library/filesystem.component';

let win: BrowserWindow;

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

ipcMain.on("initProject", (event, groupDir) => {
  win.webContents.send("initProjectResponse", os.initProductDir(groupDir));
});

ipcMain.on("createTab", (event) => {
  //TODO
});

ipcMain.on("deleteTab", (event) => {
  //TODO
});

ipcMain.on("renameTab", (event) => {
  //TODO
});

ipcMain.on("loadNotes4Group", (event) => {
  //TODO
});

ipcMain.on("saveData", (event, note_name, note_data, groupDir) => {
  os.saveNote(note_name, note_data, groupDir)
});

ipcMain.on("createNote", (event, note_name, note_data, metadata, groupDir) => {
  os.createNote(note_name, note_data, metadata, groupDir)
});

ipcMain.on("openNote", (event, note_name, groupDir) => {
  os.getData(note_name, groupDir);
});

ipcMain.on("deleteNote", (event, note_name, metadata, groupDir) => {
  os.deleteNote(note_name,groupDir,metadata);
});

ipcMain.on("renameNote", (event, metadata, groupDir) => {
  os.updateMetadata(groupDir, metadata);
});

ipcMain.on("searchNotes", (event, pattern, groupDir) => {
  os.search(pattern,groupDir);
});