import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { ElectronService } from '../../service/electron.service.data';
import { AppState, noteSelector, fileSelector } from '../../reducers';
import { SelectNote, RenameNote, DeleteNote, NoteActionTypes } from '../../actions/note.actions';
import { DeleteFile, SaveFile } from '../../actions/file.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { stat } from 'fs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesTreeComponent implements OnInit {

  new_node_name: string = '';
  data: NotesNodeImp[]=[];

  node_selected: NotesNodeImp=null;
  private note_content:any=null;

  private destroy$: Subject<void> = new Subject<void>();

  @Input('data_saved') 
  set data_saved (d: NotesNodeImp[]){
    this.data = d;
  }

  constructor( private os_service: ElectronService,
               private store_service: Store<AppState>) {
  }

  ngOnInit() {
    this.store_service.select(noteSelector).pipe(takeUntil(this.destroy$))
    .subscribe( state => {
      console.log("Nav action ", state.type)
        if( state.note ){
          this.node_selected = new NotesNodeImp(state.note.level, state.note.selected)
          this.node_selected.name = state.note.name;
          this.node_selected.label = state.note.label;
          this.node_selected.children = Object.assign([], state.note.children);
        }else{
          this.node_selected = state.note;
        }
        
        this.exec_action( state.type );  
    });
    this.store_service.select(fileSelector).pipe(takeUntil(this.destroy$))
    .subscribe( state => {
      console.log("Nav action ", state.type)
      if( state.file ){
        this.note_content = state.data;
      }
    });
  }

  
  exec_action(action: string) {
    let index = this.data.findIndex(node => node.name == this.node_selected.name && node.level == this.node_selected.level);
          
    switch (action) {
      case NoteActionTypes.AddNote: {

        if (this.data.length == 0 && this.node_selected == null) {
          this.addNode(1);
        } else {
          this.addNode(this.node_selected.level);
          //Add children
          // if (!this.data[index].children) {
              //   this.data[index].children = []
              // }
          //}
        }

        break;
      };
      case NoteActionTypes.DeleteNote: {
        if (index >= 0) {
          this.data.splice(index, 1);
          console.log("Dispatch deleteNote")
          this.store_service.dispatch(new DeleteFile({file: this.node_selected, data: {"ops":[]} } ));
          this.node_selected = null;
        }
        break;
      };
      case NoteActionTypes.ClearNameNote: {
        this.renameNode();
        break;
      };
      case NoteActionTypes.RenameNote: {

        this.selectNode(this.node_selected)
        break;
      };
      case NoteActionTypes.SelectNote: {
        console.log("node selected ")
        break;
      };
      default: {
        //save statements; 
        break;
      };
    }
  }

  selectNode(devent: NotesNodeImp) {
    let event = Object.assign({}, devent);
    event.selected = !event.selected;
    console.log("Note selected ", devent)
    //Only fire when the new node selected is different
    //than the previous node selected
    if( this.node_selected && this.node_selected.label != event.label){
      console.log(" nav selected nodes", this.node_selected );
      console.log("Dispatch SaveFile")
      this.store_service.dispatch( new SaveFile({file: this.node_selected, data: this.note_content}))
      console.log("Dispatch SelectNote")
      this.store_service.dispatch(new SelectNote({note: event}));
    }
    console.log("Dispatch SelectNote")
    this.store_service.dispatch(new SelectNote({note: event}));
  }

  addNode(level:number) {
    if( this.node_selected && this.node_selected.label != "" ){
      console.log("Dispatch SaveFile")
      this.store_service.dispatch( new SaveFile({file: this.node_selected, data: this.note_content}))
    }

    this.data.push(new NotesNodeImp(level, true));
    this.node_selected = new NotesNodeImp(level, true);
    console.log("Dispatch SelectNote")
    this.store_service.dispatch(new SelectNote({note: this.node_selected}));
    setTimeout(() => { // this will make the execution after the above boolean has changed
      (<HTMLInputElement>document.getElementById("note_name_input")).focus();
    }, 0);
  }

  setNodeName() {
    let selected = this.data.findIndex(ren_node => ren_node.label == '');
    if( this.new_node_name == ''){
      this.data[selected].setLabel('Note_'+this.getFormattedDate());
    }else{
      this.data[selected].setLabel(this.new_node_name);
      this.new_node_name = '';
    }

    this.data[selected].selected = true;
  
    console.log("Dispatch RenameNote")
    this.store_service.dispatch( new RenameNote({note: this.data[selected]}));
  }

  renameNode(){
    let index_selected = this.data.findIndex(ren_node => ren_node.label == this.node_selected.label);
    console.log("node_selected type ", typeof this.node_selected);
    this.node_selected.setLabel('');
    this.data[index_selected] = this.node_selected;
    
    setTimeout(() => { // this will make the execution after the above boolean has changed
      (<HTMLInputElement>document.getElementById("note_name_input")).focus();
    }, 0);
  }

  getFormattedDate(){
    let date = new Date();
    let month = date.getMonth() < 10 ? '0'+(date.getMonth()+1):(date.getMonth()+1);
    let day = date.getDate() < 10 ? '0'+ date.getDate():date.getDate();
    let hour = date.getHours() < 10 ? '0'+date.getHours():date.getHours();
    let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes(): date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0'+date.getSeconds(): date.getSeconds();
    let string_date =  month+'-'+day+'-'+hour+':'+minutes+':'+seconds;
    return string_date;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

