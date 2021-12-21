import { Component, OnInit } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { ResizeEvent } from 'angular-resizable-element';
import { BaseDirService } from 'src/app/service/baseDir.service';
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
  baseDir:string='';
  
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private baseDirService:BaseDirService) { }

  ngOnInit(): void {
    this.baseDirService.baseDirMetadata.pipe(takeUntil(this.destroy$))
      .subscribe((sourceBaseDir: string) => this.baseDir = sourceBaseDir);
    // this.store_service.select(state => state).pipe(takeUntil(this.destroy$))
    // .subscribe( state => {
    //   this.isSelected =  state.note.note != null;
    // });
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
  }

}
