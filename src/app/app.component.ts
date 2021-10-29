import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NotesNodeImp } from './utils/NotesNodeImp';
import { ResizeEvent } from 'angular-resizable-element';
import { ElectronServiceFile } from './service/electron.service.files';
import { Store } from '@ngrx/store';
import { AppState } from './reducers';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import {FormControl} from '@angular/forms';

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

  tabs = ['First', 'Second', 'Third'];
  selected = new FormControl(0);

  private destroy$: Subject<void> = new Subject<void>();
  
  ngOnInit(){
    this.electron_service.notes.pipe(takeUntil(this.destroy$))
    .subscribe( notes =>{
      
      notes.forEach( note => {
        let name_parts = note.split('-'); 
        let notesObj =new NotesNodeImp(Number.parseInt(name_parts[0]));
        notesObj.name = note;
        notesObj.label = name_parts[1];
        this.NOTES_DATA.push(notesObj);
      });
      this.zone.run(() => this.NOTES_DATA );
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

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

}
