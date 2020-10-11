import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NotesNodeImp } from './utils/NotesNodeImp';
import { ResizeEvent } from 'angular-resizable-element';
import { ElectronServiceFile } from './service/electron.service.files';
import { Store } from '@ngrx/store';
import { AppState } from './reducers';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'myLifeNotes';
  public style: object = {};
  isSelected:boolean=false;
  NOTES_DATA: NotesNodeImp[]=[];

  private destroy$: Subject<void> = new Subject<void>();
  
  ngOnInit(){
    this.electron_service.notes.pipe(takeUntil(this.destroy$))
    .subscribe( notes =>{
      let tmp = [];
      notes.forEach( note => {
        let name_parts = note.split('-'); 
        let notesObj =new NotesNodeImp(Number.parseInt(name_parts[0]));
        notesObj.name = note;
        notesObj.label = name_parts[1];
        tmp.push(notesObj);
      });
      this.NOTES_DATA = Object.assign([], tmp);
      this.zone.run(() => this.NOTES_DATA = Object.assign([], tmp));
    })
    this.store_service.select(state => state).pipe(takeUntil(this.destroy$))
    .subscribe( state => {
      this.isSelected =  state.note.note != null;
    });
  }


  constructor(private electron_service: ElectronServiceFile,
              public zone: NgZone,
              private store_service: Store<AppState>){
    this.electron_service.loadFiles();
    
  }
  
  onResizeEnd(event: ResizeEvent): void {

    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  } 


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
