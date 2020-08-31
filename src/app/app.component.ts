import { Component, OnInit } from '@angular/core';
import { NotesNodeImp } from './utils/notes-node';
import { ResizeEvent } from 'angular-resizable-element';
import { ElectronService } from './service/electron.service';
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
  NOTES_DATA: NotesNodeImp[]=[];/* = 
  [
    {
      name: 'Fruit',
      level:1,
      children: [
        {name: 'Apple', level:2},
        {name: 'Banana', level:2 },
        {name: 'Fruit loops', level:2},
      ]
    }, {
      name: 'Vegetables', level:1,
      children: [
        {
          name: 'Green', level:2, 
          children: [
            {name: 'Broccoli', level:3 },
            {name: 'Brussels sprouts', level:3},
          ]
        }, {
          name: 'Orange', level:2, 
          children: [
            {name: 'Pumpkins', level:3},
            {name: 'Carrots', level:3},
          ]
        },
      ]
    },
  ];*/
  
  ngOnInit(){
    this.electron_service.notes.subscribe( notes =>{
      console.log("app.component notes ", notes);
      notes.forEach( note => {
        let name_parts = note.split('-'); 
        let notesObj =new NotesNodeImp(Number.parseInt(name_parts[0]));
        notesObj.name = note;
        notesObj.label = name_parts[1];
        this.NOTES_DATA.push(notesObj);
        this.NOTES_DATA = Object.assign([], this.NOTES_DATA);
      });
    })
    this.select_service.currentNode.subscribe(node => this.isSelected = node!=null)
  }


  constructor(private electron_service: ElectronService,
              private select_service: SelectedNodeService){
    
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
