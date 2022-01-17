import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
//TODO delete me!
export class ElectronDataService {

  private ipc: IpcRenderer
  private data = new BehaviorSubject<any>({});
  private matched_notes=new BehaviorSubject<string[]>([]);
  currentMessage = this.matched_notes.asObservable();

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
    
        this.ipc.on('getNoteDataResponse', (event, data) => {
          this.data.next(data);
        });
        this.ipc.on('searchResponse', (event, data) => {
          this.matched_notes.next(data);
        });
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
    
  }

  getNote(note_name:string) {
    this.ipc.send('openNote', note_name);
  }

  deleteNote(note_name:string) {
    this.ipc.send('deleteNote', note_name);
  }

  renameNote(existing_note_name:string,note_name:string) {
    this.ipc.send('renameNote', [existing_note_name, note_name]);
  }

  saveData( note_name: string, note_data: any){
    this.ipc.send('saveData', note_name, note_data);
  }

  searchNotes( keyword:string){
    this.ipc.send('searchNotes',keyword);
  }
}
