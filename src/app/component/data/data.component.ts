import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'
import { DataService } from '../../service/data.service';
import { interval, Subscription, VirtualTimeScheduler } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { DataState } from '../../utils/interfaces';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesDataComponent implements OnInit, OnDestroy {

  editor: Quill;
  blurred = false
  focused = false
  dirty: boolean = false;
  node_selected: NotesNodeImp = null;
  subscription: Subscription;
  source = interval(environment.save_time);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService:DataService) {
  }

  ngOnInit(): void {

    this.dataService.stateDataObservable.pipe(takeUntil(this.destroy$))
    .subscribe((data: DataState) => {
      let selected_note = data.current_tab_notes_metadata.find( note => note.selected);
      if( this.node_selected != null && selected_note.name != this.node_selected.name ){
        this.saveData();
      }
      this.node_selected = new NotesNodeImp(selected_note.level,true);
      this.node_selected.setAllPropertis(selected_note.name,selected_note.label,selected_note.children);
      if( this.editor ){
        this.editor.setContents([{insert:''}]);
      }
      console.log("New data ", this.node_selected)
    });

    this.subscription = this.source.pipe(takeUntil(this.destroy$))
      .subscribe(val => this.saveData());
  }

  created($event: Quill) {

    this.editor = Object.assign($event);
    if (this.editor) {
      this.editor.setContents([{insert:''}]);
    }else{
      console.log('No editor!!!!!!!!!!!!!!1')
    }
  }

  changedEditor($event: EditorChangeContent | EditorChangeSelection) {
    this.editor.getContents();
    this.dirty = true;
  }

  saveData() {
    if (this.dirty && this.node_selected ) {
      this.dataService.saveData(this.node_selected, JSON.stringify(this.editor.getContents()));
    }
    this.dirty = false;
  }

  focus($event) {
    console.log("focus ", $event)
    this.focused = true
    this.blurred = false
  }

  blur($event) {
    console.log("blur ", $event)
    if( this.focus ){
      this.saveData();
    }

    this.focused = false
    this.blurred = true
  }

  setFocus() {
    console.log("setFocus ");
    setTimeout(() => {
      (<HTMLInputElement>document.getElementById("note_editor")).focus();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
