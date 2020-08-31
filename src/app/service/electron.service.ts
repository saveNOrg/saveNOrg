import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private ipc: IpcRenderer
  notes = new BehaviorSubject<string[]>([]);
  data = new BehaviorSubject<any>({});

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
    // //electron.ipcRenderer
    // this.ipc.on('getImagesResponse', (event, images) => {
    //   this.images.next(images);
    // });
    // //electron.ipcRenderer
    // this.ipc.on('getDirectoryResponse', (event, directory) => {
    //   this.directory.next(directory);
    // });
    this.ipc.send('loadNotes');
    
    this.ipc.on('getNotesResponse', (event, note) => {
      this.notes.next(note);
      console.log("available notes ", note);
    });
    
    this.ipc.on('getNoteDataResponse', (event, data) => {
      console.log("available notes ", data);
      this.data.next(data);
      console.log("available notes ", data);
    });
  }

  getNote(note_name:string) {
    //electron.ipcRenderer
    this.ipc.send('openNotes', note_name);
  }

  saveData( note_name: string, note_data: any){
    this.ipc.send('saveData', note_name, note_data);
  }
}
