import { Component, OnInit, NgZone } from '@angular/core';
import { NotesNodeImp } from './utils/notes-node';
import { ResizeEvent } from 'angular-resizable-element';
import { ElectronServiceFile } from './service/electron.service.files';
import { SelectedNodeService } from './service/selected-node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'myLifeNotes';
  public style: object = {};
  isSelected:boolean=false;
  NOTES_DATA: NotesNodeImp[]=[];
  
  ngOnInit(){
    this.electron_service.notes.subscribe( notes =>{
      console.log("app.component notes ", notes);
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
      console.log("app.component this.NOTES_DATA ", this.NOTES_DATA);
    })
    this.select_service.currentNode.subscribe(node => this.isSelected = node!=null)
  }


  constructor(private electron_service: ElectronServiceFile,
              private select_service: SelectedNodeService,
              public zone: NgZone){
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
}
