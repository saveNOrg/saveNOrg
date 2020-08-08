import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ElectronService } from 'src/app/service/electron.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  value:string='';
  constructor( private electron_service: ElectronService) { }

  ngOnInit(): void {
  }

  saveNote(){
    console.log("saving the note");
    this.electron_service.saveData("note1",{"name":"note2","data":"data for note1"})
  }

}
