import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private ipc: IpcRenderer
  images = new BehaviorSubject<string[]>([]);
  directory = new BehaviorSubject<string[]>([]);

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
    //electron.ipcRenderer
    this.ipc.on('getImagesResponse', (event, images) => {
      this.images.next(images);
    });
    //electron.ipcRenderer
    this.ipc.on('getDirectoryResponse', (event, directory) => {
      this.directory.next(directory);
    });
  }

  navigateDirectory(path) {
    //electron.ipcRenderer
    this.ipc.send('navigateDirectory', path);
  }

  saveData( note_name: string, note_data: any){
    this.ipc.send('saveData', note_name, note_data);
  }
}
