import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { Store } from '@ngrx/store';
import { AppState, noteSelector } from '../../reducers';
import { ClearNameNote, AddNote, DeleteNote, SelectNote } from '../../actions/note.actions';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { ElectronServiceData } from '../../service/electron.service.data';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit, OnDestroy {

  message: string = '';
  node_selected: NotesNodeImp = null;
  search_keyword: string = '';
  base_dir:string ='';
  match_notes: string[] = [];
  match_index:number=0;

  private destroy$: Subject<void> = new Subject<void>();


  constructor(private os_service: ElectronServiceData,
    private store_service: Store<AppState>) { }

  ngOnInit(): void {
    this.store_service.select(noteSelector).pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.note) {
          this.node_selected = state.note;
          this.message = state.type;
        }
      });
    this.os_service.matched_notes.pipe(takeUntil(this.destroy$))
      .subscribe(matched_notes => {
        this.match_notes = matched_notes;
        if( this.match_notes.length > 0 ){
          this.match_index = 0;
          this.store_service.dispatch(new SelectNote( { note: this.getNotesNodeImp(this.match_notes[this.match_index])} ) )
        }
      });
  }

  getNotesNodeImp(note_name: string) {
    let name_parts = note_name.split('-');
    let notesObj = new NotesNodeImp(Number.parseInt(name_parts[0]));
    notesObj.name = note_name;
    notesObj.label = name_parts[1];
    return notesObj;
  }

  previous(){
    let index = this.match_notes.findIndex(note_name => this.node_selected.name == note_name);
    if( index == 0 ){
      this.match_index = this.match_notes.length-1;
    }else{
      this.match_index = index -1 ;
    }
    this.store_service.dispatch(new SelectNote({ note: this.getNotesNodeImp(this.match_notes[this.match_index])  }))
  }

  next(){
    let index = this.match_notes.findIndex(note_name => this.node_selected.name == note_name);
    if( index == this.match_notes.length-1 ){
      this.match_index = 0;
    }else{
      this.match_index = index+1;
    }
    this.store_service.dispatch(new SelectNote({ note: this.getNotesNodeImp(this.match_notes[this.match_index])  }))
  }

  renameNote() {
    if (this.node_selected) {
      this.store_service.dispatch(new ClearNameNote({ note: this.node_selected }));
    }
  }

  addNote() {
    this.store_service.dispatch(new AddNote({ note: this.node_selected }));
  }

  deleteNote() {
    if (this.node_selected) {
      this.store_service.dispatch(new DeleteNote({ note: this.node_selected }));
    }
  }

  search() {
    this.os_service.searchNotes(this.search_keyword);

  }

  updateBaseDir(){

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
