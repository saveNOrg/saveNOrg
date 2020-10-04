import { Component, OnInit } from '@angular/core';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill'
import Quill from 'quill'
import { ElectronService } from '../../service/electron.service.data';
import { interval, Subscription, VirtualTimeScheduler } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { FileActionTypes, DirtyFile } from '../../actions/file.actions';
import { NotesNodeImp } from '../../utils/notes-node';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class NotesDataComponent implements OnInit {

  editor: Quill;
  blurred = false
  focused = false
  dirty:boolean = false;
  node_selected: NotesNodeImp;
  data: any = null;
  subscription: Subscription;
  source = interval(environment.save_time);

  constructor(private os_service: ElectronService,
              private store_service: Store<AppState>) {
  }

  ngOnInit(): void {

    this.store_service.select( state => state).subscribe(state => {
      if( this.node_selected && state.file.file &&
        state.file.file.name != this.node_selected.name){
        this.saveData();
        this.data = {};
      }
      this.node_selected = state.file.file;
      let action = state.file.type;

      let data = state.file.data;
      if (this.node_selected && data ) {
          // setTimeout(() => {
          // (<HTMLInputElement>document.getElementById("note_editor")).focus();
          // }, 0);
          this.data = data;//Object.assign({},data);
     }
      this.exec_action(action);
    });

    this.subscription = this.source.subscribe(val => this.saveData());
  }

  exec_action(action: string) {
    switch (action) {
      case FileActionTypes.SaveFile: {
        this.saveData();
        this.data = null;
        break;
      }
      case FileActionTypes.DeleteFile: {
        //statements; 
        break;
      }
      case FileActionTypes.DirtyFile: {
        this.saveData();

        break;
      }
      case FileActionTypes.LoadFile: {
        console.log("Load data")
        if( this.editor){
          this.updateData();
        }
        break;
      }
      default: {
        //save statements; 
        break;
      }
    }
  }

  updateData(){
    if( this.data && Object.keys(this.data).length > 0 ){
      let saved_data =  JSON.parse( this.data  );
      //let saved_data =  this.data  ;
      if( saved_data['ops'] ){
        this.editor.setContents( saved_data['ops'] );
      }
    }else{
      this.editor.setContents( {} );
    }
  }

  created($event: Quill) {
    console.log('editor-created: ', $event)
    console.log('data: ', this.data)
    this.editor = $event;
    if( this.data && this.editor){
      this.updateData();
    }
  }

  changedEditor($event: EditorChangeContent | EditorChangeSelection) {
    this.data = this.editor.getContents();
    this.store_service.dispatch(new DirtyFile({file:this.node_selected, data: this.data}));
    this.dirty = true;
  }

  saveData() {
    if( this.dirty ){
      this.os_service.saveData(this.node_selected.name, JSON.stringify( this.editor.getContents() ) );
      this.dirty = false;
    }
    
  }

  focus($event) {
    this.focused = true
    this.blurred = false
  }

  blur($event) {
    this.focused = false
    this.blurred = true
  }


}
