import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcRenderer } from 'electron';
import { NotesNodeImp } from '../utils/notes-node'


@Injectable({
  providedIn: 'root'
})
export class ElectronServiceFile {

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
    
    this.ipc.on('getNotesResponse', (event, notes) => {
      console.log("available notes ", notes);
      this.notes.next(notes);
    });
    
  }

  loadFiles(){
    console.log('load files: ');
    this.ipc.send('loadNotes');
  }

}
