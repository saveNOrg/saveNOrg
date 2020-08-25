import { Component, OnInit } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'
import { ElectronService } from '../../service/electron.service';
import { SelectedNodeService } from '../../service/selected-node.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-data',
  templateUrl: './notes-data.component.html',
  styleUrls: ['./notes-data.component.scss']
})
export class NotesDataComponent implements OnInit {
  
  editor:Quill;
  blurred = false
  focused = false
  note_name: string='';
  data:any;
  subscription: Subscription;
  //emit value in sequence every 10 second
  source = interval(30000);

  constructor(private os_service: ElectronService,
              private select_service: SelectedNodeService) { 
  }

  ngOnInit(): void {
    this.select_service.currentNode.subscribe(node => this.note_name = node.name)
    this.subscription = this.source.subscribe(val => this.saveData());
  }
  

  created(event: Quill) {
    // tslint:disable-next-line:no-console
    //console.log('editor-created', event)
    this.editor = event;
    
    //const range = this.editor.getSelection(true)
    //let delta = this.editor.setContents([
    //  { insert: 'Hello ' },
    //  { insert: 'World!', attributes: { bold: true } },
    //  { insert: '\n' }
    //]);
    //console.log("delta after set content ", delta)
    //delta = this.editor.insertEmbed(range.index, 'image', 'https://cloud.githubusercontent.com/assets/2264672/20601381/a51753d4-b258-11e6-92c2-1d79efa5bede.png', 'user')
    //console.log("delta after insert ", delta)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event)
    console.log('editor ', this.editor.getContents());
    this.data = this.editor.getContents();
    //this.os_service.saveData(this.note_name, this.editor.getContents());
  }

  saveData(){
    this.os_service.saveData(this.note_name, this.editor.getContents());
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    //console.log('focus', $event)
    this.focused = true
    this.blurred = false
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    //console.log('blur', $event)
    this.focused = false
    this.blurred = true
  }


}
