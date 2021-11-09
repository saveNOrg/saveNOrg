import { Component, OnInit } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { ResizeEvent } from 'angular-resizable-element';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { AddNote } from '../../actions/note.actions';

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab-body',
  templateUrl: './tab-body.component.html',
  styleUrls: ['./tab-body.component.scss']
})
export class TabBodyComponent implements OnInit {

  NOTES_DATA: NotesNodeImp[]=[];
  public style: object = {};
  isSelected:boolean=false;
  node_selected: NotesNodeImp = null;
  
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private store_service: Store<AppState>) { }

  ngOnInit(): void {

    this.store_service.select(state => state).pipe(takeUntil(this.destroy$))
    .subscribe( state => {
      this.isSelected =  state.note.note != null;
    });
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

  addNote() {
    this.store_service.dispatch(new AddNote({ note: this.node_selected }));
  }

}
