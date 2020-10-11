import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NotesNodeImp } from '../../utils/notes-node';
import { Store } from '@ngrx/store';
import { AppState, noteSelector } from '../../reducers';
import { RenameNote, AddNote, DeleteNote, NoteActionTypes } from '../../actions/note.actions';
import { SaveFile } from '../../actions/file.actions';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit, OnDestroy {

  message:string='';
  node_selected:NotesNodeImp=null;

  private destroy$: Subject<void> = new Subject<void>();


  constructor( private store_service: Store<AppState> ) { }

  ngOnInit(): void {
    this.store_service.select ( noteSelector ).pipe(takeUntil(this.destroy$))
    .subscribe( state => {
      console.log("Toolbar state ", state.type)
      if( state.note ){
        this.node_selected = state.note;
        this.message = state.type;
      }
    });
  }

  editNote(){
    if( this.message != NoteActionTypes.RenameNote && this.node_selected){
      console.log("Dispatch RenameNote")
      this.store_service.dispatch(new RenameNote({note: this.node_selected}));
    }
  }

  addNote(){
    if( this.message != NoteActionTypes.AddNote){
      console.log("Dispatch AddNote")
      this.store_service.dispatch(new AddNote({note: this.node_selected}));
    }
  }

  deleteNote(){
    if( this.message != NoteActionTypes.DeleteNote && this.node_selected){
      console.log("Dispatch DeleteNote")
      this.store_service.dispatch(new DeleteNote({note: this.node_selected}));
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
