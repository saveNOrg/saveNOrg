import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IpcRenderer } from 'electron';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseDirService {
  
  private ipc: IpcRenderer
  private baseDirSource = new BehaviorSubject({});
  baseDirMetadata = this.baseDirSource.asObservable();
  inside_electron:boolean=true;
  serverUrl:string=environment.serverUrl;
  service_path:string='initProject'

  constructor(private http: HttpClient) { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;

        this.ipc.on('initProjectResponse', (event, data) => {
          this.baseDirSource.next(data)
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
      this.workspaceInitLocal(workspaceDir);
    }else{
      this.workspaceInitRemote(workspaceDir);
    }
  }

  workspaceInitLocal(workspaceDir: string) {
    this.ipc.send(this.service_path, workspaceDir);
  }
  
  workspaceInitRemote(workspaceDir: string) {
    this.http.post(this.serverUrl+'/'+this.service_path, {"groupDir": workspaceDir })
    .subscribe(
      data => {
        console.log('success', data)
        this.baseDirSource.next(data)
      },
      error => {
        this.handleError(error);
      }
    );;

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



