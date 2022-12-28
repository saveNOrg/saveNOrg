import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IpcRenderer } from 'electron';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataState } from '../utils/interfaces';
import { NotesNodeImp } from '../utils/NotesNodeImp';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private ipc: IpcRenderer
  inside_electron:boolean=true;
  private serverUrl:string=environment.serverUrl;
  
  dataState:DataState={
    "base_dir": '',
    "current_tab_id": '',
    "current_note_id": '',
    "tabs": [],
    "current_tab_notes_metadata": []
  };
  private baseDirSource = new BehaviorSubject<DataState>(this.dataState);
  stateDataObservable = this.baseDirSource.asObservable();
  
  
  init_project_path:string='initProject';
  create_note_path:string='createNote';
  rename_note_path:string='renameNote';
  save_note_data_path:string='saveData';
  search_notes_path:string='searchNotes';

  constructor(private http: HttpClient) { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;

        this.ipc.on('initProjectResponse', (event, data) => {
          this.updateWorkspaceData(data)
        });
        
      } catch (e) {
        throw e;
      }
    } else {
      this.inside_electron = false;
    }
  }

  setWorkspaceDir(workspaceDir: string) {
    if( this.inside_electron){
      this.ipc.send(this.init_project_path, workspaceDir);
    }else{
      this.http.post(this.serverUrl+'/'+this.init_project_path, {"workspaceDir": workspaceDir })
      .subscribe(
        data => {
          this.updateWorkspaceData(data)
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  updateWorkspaceData(data:any){
    this.dataState.base_dir = data['extra']['baseDir'];
        this.dataState.current_tab_id = data['extra']['tabs'][0]['id'];
        let firstTab ={
          name: data['extra']['tabs'][0]['name'],
          id: data['extra']['tabs'][0]['id'],
          order: 0 , 
          icon: ''
        }
        this.dataState.tabs = [firstTab];
        this.baseDirSource.next(this.dataState)
  }

  addNote(){
    let current_note = null;
    let new_note = new NotesNodeImp(current_note? (current_note.level+1):0, true); 
    if( this.dataState.current_note_id ){
      let current_note_index = this.dataState.current_tab_notes_metadata.findIndex( note =>{
        return note.name == this.dataState.current_note_id;
      })
      this.dataState.current_tab_notes_metadata[current_note_index].selected = false;
      current_note = this.dataState.current_tab_notes_metadata[current_note_index];
    }else{
      this.dataState.current_note_id = new_note.name;
    }

    this.dataState.current_tab_notes_metadata.push( new_note );
    if( this.inside_electron){
      this.ipc.send(this.create_note_path, 
                    new_note.name,
                    '{}',
                    this.dataState.current_tab_notes_metadata,
                    this.dataState.base_dir);
                    this.baseDirSource.next(this.dataState);
    }else{
      this.http.post(this.serverUrl+'/'+this.create_note_path, 
      {
        "id":new_note.name,
        "data":'{}',
        "metadata":this.dataState.current_tab_notes_metadata,
        "groupDir": this.getGroupDir() })
      .subscribe(
        data => {
          console.log("create note result", data);
          this.baseDirSource.next(this.dataState);
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  saveData(note2Save:NotesNodeImp, data:string){
    if( this.inside_electron){
      this.ipc.send(this.save_note_data_path, 
                    note2Save.name,
                    data,
                    this.dataState.current_tab_notes_metadata,
                    this.dataState.base_dir);
    }else{
      this.http.post(this.serverUrl+'/'+this.save_note_data_path, 
      {
        "id":       note2Save.name,
        "data":     data,
        "metadata": this.dataState.current_tab_notes_metadata,
        "groupDir": this.getGroupDir() })
      .subscribe(
        data => {
          console.log("create note result", data)
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  renameNote(note2Rename:NotesNodeImp){
    const index = this.dataState.current_tab_notes_metadata.findIndex(note => note.name == note2Rename.name);
    this.dataState.current_tab_notes_metadata[index]=note2Rename;
    if( this.inside_electron){
      this.ipc.send(this.rename_note_path, 
                    note2Rename.name,
                    '{}',
                    this.dataState.current_tab_notes_metadata,
                    this.dataState.base_dir);
    }else{
      this.http.post(this.serverUrl+'/'+this.rename_note_path, 
      {
        "id":note2Rename.name,
        "data":'{}',
        "metadata":this.dataState.current_tab_notes_metadata,
        "groupDir": this.getGroupDir() })
      .subscribe(
        data => {
          console.log("create note result", data)
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  searchNotes(pattern:string){
    if( this.inside_electron){
      this.ipc.send(this.search_notes_path, 
                    this.dataState.base_dir,
                    pattern);
    }else{
      this.http.post(this.serverUrl+'/'+this.search_notes_path, 
      {
        "groupDir": this.getGroupDir(),
        "pattern": pattern })
      .subscribe(
        data => {
          console.log("create note result", data)
        },
        error => {
          this.handleError(error);
        }
      );
    }
  }

  private getGroupDir(){
    if( this.dataState.base_dir.indexOf("\\") >= 0 ){
      return this.dataState.base_dir+"\\"+this.dataState.current_tab_id;
    }else{
      return this.dataState.base_dir+"/"+this.dataState.current_tab_id;
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}



