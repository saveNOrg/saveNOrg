import { Component, OnInit } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { ResizeEvent } from 'angular-resizable-element';
import { DataService } from '../../service/data.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DataState } from '../../utils/interfaces';

@Component({
  selector: 'app-tab-body',
  templateUrl: './tab-body.component.html',
  styleUrls: ['./tab-body.component.scss']
})
export class TabBodyComponent implements OnInit {


  public style: object = {};
  stateData: DataState;
  isSelected:boolean=false;
  
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.dataService.stateDataObservable.pipe(takeUntil(this.destroy$))
      .subscribe((stateData: DataState) => {
        this.stateData = stateData
        this.isSelected = stateData.current_note_id?true:false;
      } );
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
    this.dataService.addNote();
    this.isSelected=true;
  }

}
