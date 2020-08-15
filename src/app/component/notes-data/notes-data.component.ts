import { Component, OnInit } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'

@Component({
  selector: 'app-notes-data',
  templateUrl: './notes-data.component.html',
  styleUrls: ['./notes-data.component.scss']
})
export class NotesDataComponent implements OnInit {
  
  editor:Quill;
  blurred = false
  focused = false

  constructor() { 
  }

  ngOnInit(): void {
  }
  

  created(event: Quill) {
    // tslint:disable-next-line:no-console
    //console.log('editor-created', event)
    this.editor = event;
    
    const range = this.editor.getSelection(true)
    let delta = this.editor.setContents([
      { insert: 'Hello ' },
      { insert: 'World!', attributes: { bold: true } },
      { insert: '\n' }
    ]);
    //console.log("delta after set content ", delta)
    delta = this.editor.insertEmbed(range.index, 'image', 'https://cloud.githubusercontent.com/assets/2264672/20601381/a51753d4-b258-11e6-92c2-1d79efa5bede.png', 'user')
    //console.log("delta after insert ", delta)
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    //console.log('editor-change', event)
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
