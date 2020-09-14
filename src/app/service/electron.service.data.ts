import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcRenderer } from 'electron';
import { NotesNodeImp } from '../utils/notes-node'


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
    
        this.ipc.on('getNoteDataResponse', (event, data) => {
          this.data.next(data);
        });
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
    
  }

  getNote(note_name:string) {
    this.ipc.send('openNotes', note_name);
  }

  saveData( note_name: string, note_data: any){
    this.ipc.send('saveData', note_name, note_data);
  }
}
