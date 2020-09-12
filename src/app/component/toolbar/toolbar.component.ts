import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotesActionService } from "../../service/notes-action.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  message:string='';

  constructor( private action_service: NotesActionService) { }

  ngOnInit(): void {
    this.action_service.currentMessage.subscribe(message => this.message = message)
  }

  saveNote(){
    console.log("saving the note");
    this.action_service.changeMessage("save")
  }

  addNote(){
    console.log("saving the note");
    this.action_service.changeMessage("add")
  }

  deleteNote(){
    console.log("saving the note");
    this.action_service.changeMessage("delete")
  }

}
