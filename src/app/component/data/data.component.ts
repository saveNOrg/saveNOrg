import { Component, OnInit } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'
import { ElectronService } from '../../service/electron.service';
import { SelectedNodeService } from '../../service/selected-node.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class NotesDataComponent implements OnInit {

  editor: Quill;
  blurred = false
  focused = false
  changed:boolean = false;
  note_name: string = '';
  data: any;
  subscription: Subscription;
  //emit value in sequence every 10 second
  source = interval(30000);

  constructor(private os_service: ElectronService,
    private select_service: SelectedNodeService) {
  }

  ngOnInit(): void {
    this.select_service.currentNode.subscribe(node => {
      this.note_name = '';
      if (node) {
        this.note_name = node.name;
        this.os_service.data.subscribe(data => {
          console.log("data read " , data)
          console.log("editor " , this.editor)
          setTimeout(() => {
          (<HTMLInputElement>document.getElementById("note_editor")).focus();
          }, 0);
          //let editor_container = <HTMLInputElement>document.getElementById("note_editor");
          //this.editor = new Quill(editor_container);
          //console.log("editor " , editor)
          this.data = data;
          if( this.editor){
            this.updateData();
          }
            
        });
      }
    });
    this.subscription = this.source.subscribe(val => this.saveData());
  }

  updateData(){
    if( Object.keys(this.data).length > 0 ){
      let saved_data = JSON.parse( JSON.parse( this.data ) );
      console.log("saved_data ", saved_data)
      this.editor.setContents( saved_data['ops'] );
    }
  }

  created($event: Quill) {
    // tslint:disable-next-line:no-console
    console.log('editor-created: ', $event)
    console.log('data: ', this.data)
    this.editor = $event;
    if( this.data && this.editor){
      this.updateData();
    }

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

  changedEditor($event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', $event)
    console.log('editor ', this.editor.getContents());
    this.data = this.editor.getContents();
    //this.os_service.saveData(this.note_name, this.editor.getContents());
    this.changed = true;
  }

  saveData() {
    if( this.changed ){
      this.os_service.saveData(this.note_name, JSON.stringify( this.editor.getContents() ) );
    }
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
