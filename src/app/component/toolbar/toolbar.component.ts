import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotesNodeImp } from '../../utils/notes-node';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { RenameNote, AddNote, DeleteNote, NoteActionTypes } from '../../actions/note.actions';
import { SaveFile } from '../../actions/file.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  message:string='';
  node_selected:NotesNodeImp=null;


  constructor( private store_service: Store<AppState> ) { }

  ngOnInit(): void {
    this.store_service.select(state => state).subscribe( state => {
      this.node_selected = state.note.note;
      this.message = state.note.type;
    });
  }

  editNote(){
    if( this.message != NoteActionTypes.RenameNote && this.node_selected){
      this.store_service.dispatch(new RenameNote({note: this.node_selected}));
    }
  }

  addNote(){
    if( this.message != NoteActionTypes.AddNote){
      this.store_service.dispatch(new AddNote({note: this.node_selected}));
    }
  }

  deleteNote(){
    if( this.message != NoteActionTypes.DeleteNote && this.node_selected){
      this.store_service.dispatch(new DeleteNote({note: this.node_selected}));
    }
  }

}
