import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ElectronServiceFile {

  private ipc: IpcRenderer
  notes = new BehaviorSubject<string[]>([]);
  data = new BehaviorSubject<any>({});
  inside_electron:boolean=true;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
        this.ipc.on('getNotesResponse', (event, notes) => {
          this.notes.next(notes);
        });
      } catch (e) {
        throw e;
      }
    } else {
      this.inside_electron = false;
    }
    
  }

  loadFiles(){
    if( this.inside_electron ){
      this.ipc.send('loadNotes');
    }
  }

}
