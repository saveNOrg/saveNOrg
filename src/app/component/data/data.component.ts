import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'
import { ElectronService } from '../../service/electron.service.data';
import { interval, Subscription, VirtualTimeScheduler } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState, noteSelector, fileSelector } from '../../reducers';
import { FileActionTypes, DirtyFile } from '../../actions/file.actions';
import { NoteActionTypes } from '../../actions/note.actions';
import { NotesNodeImp } from '../../utils/notes-node';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { timeStamp } from 'console';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class NotesDataComponent implements OnInit, OnDestroy {

  editor: Quill;
  blurred = false
  focused = false
  dirty:boolean = false;
  node_selected: NotesNodeImp = null;
  data: any = null;
  subscription: Subscription;
  source = interval(environment.save_time);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private os_service: ElectronService,
              private store_service: Store<AppState>) {
  }

  ngOnInit(): void {

    this.store_service.select( fileSelector ).pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      console.log("Data action ", state.type)

      if( state.file ){

        this.node_selected = state.file;
        let action = state.type;
        let data = state.data;

        if (this.node_selected && data ) {
            this.data = data;
       }
        this.exec_action(action);
      }
    });

    this.store_service.select( noteSelector ).pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      console.log("Data action ", state.type)
      if( state.type === NoteActionTypes.RenameNote)
        this.node_selected = state.note;
        console.log("Rename note ", this.node_selected)
    });

    this.subscription = this.source.pipe(takeUntil(this.destroy$))
    .subscribe(val => this.saveData());
  }

  exec_action(action: string) {
    switch (action) {
      case FileActionTypes.SaveFile: {
        this.saveData();
        break;
      }
      case FileActionTypes.DeleteFile: {
        this.updateData();
        this.os_service.deleteNote( this.node_selected.name );
        this.node_selected = null;
        this.dirty = false;

        break;
      }
      // case FileActionTypes.DirtyFile: {
      //   this.saveData();

      //   break;
      // }
      case FileActionTypes.LoadFile: {
        console.log("Load data")
        if( this.editor ){
          this.updateData();
        }
        break;
      }
      default: {
        console.log("Default type ", action);
        break;
      }
    }
  }

  updateData(){
    console.log( "Type: ", typeof this.data)
    console.log( "This.data: ",  this.data)
    
    if( this.data && Object.keys(this.data).length > 0 ){

      let saved_data = {};
      if( typeof this.data === "object") saved_data = this.data;
      else  saved_data =  JSON.parse( this.data  );

      if( saved_data['ops'] ){
        this.editor.setContents( saved_data['ops'] );
        this.data = null;
      }

    }else{
      this.editor.setContents( {} );
    }

  }

  created($event: Quill) {
    console.log('editor-created: ', $event)
    this.editor = $event;
    if( this.editor ){
      this.updateData();
    }
  }

  changedEditor($event: EditorChangeContent | EditorChangeSelection) {
    this.editor.getContents();
    this.dirty = true;
  }

  saveData() {
    if( this.dirty && this.node_selected && this.node_selected.label != '' ){
      this.os_service.saveData(this.node_selected.name, JSON.stringify( this.editor.getContents() ) );
    }
    this.data = null;
    this.dirty = false;  
  }

  focus($event) {
    this.focused = true
    this.blurred = false
  }

  blur($event) {
    this.focused = false
    this.blurred = true
  }

  setFocus(){
    console.log("div clicked");
    (<HTMLInputElement>document.getElementById("note_editor")).focus();
    this.focus(null);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
