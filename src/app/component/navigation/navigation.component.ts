import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NotesNodeImp } from '../../utils/notes-node';
import { ElectronService } from '../../service/electron.service.data';
import { AppState } from '../../reducers';
import { SelectNote, RenameNote, DeleteNote, NoteActionTypes } from '../../actions/note.actions';
import { DeleteFile } from '../../actions/file.actions';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesTreeComponent implements OnInit {

  message: string = '';
  new_node_name: string = '';
  node_selected: NotesNodeImp;
  data: NotesNodeImp[]=[];

  @Input('data_saved') 
  set data_saved (d: NotesNodeImp[]){
    this.data = d;
  }


  constructor( private os_service: ElectronService,
               private store_service: Store<AppState>) {
  }

  ngOnInit() {
    this.store_service.select(state => state).subscribe( state => {
      if( state.note.note ){
        this.node_selected = Object.assign({},state.note.note);
      }else{
        this.node_selected = state.note.note;
      }
      this.message = state.note.type;
      this.exec_action( this.message );
    });
  }

  getSelected(devent) {
    let event = Object.assign({}, devent);
    event.selected = !event.selected;
    //Only fire when the new node selected is different
    //than the previous node selected
    if( this.node_selected || this.node_selected.name != event.name){
      this.store_service.dispatch(new SelectNote({note: event}));
    }
  }



  exec_action(action: string) {
    let index = this.data.findIndex(node => node.name == this.node_selected.name && node.level == this.node_selected.level);
          
    switch (action) {
      case NoteActionTypes.AddNote: {

        if (this.data.length == 0 && this.node_selected == null) {
          this.addNode(1);
        } else {
          //if (this.node_selected) {
          //Add sibling  
          if (index >= 0) {
            this.addNode(this.node_selected.level); 
          }
          //Add children
          // if (!this.data[index].children) {
              //   this.data[index].children = []
              // }
          //}
        }

        break;
      }
      case NoteActionTypes.DeleteNote: {
        if (index >= 0) {
          this.data.splice(index, 1);
          this.store_service.dispatch(new DeleteFile({file: this.node_selected, data: null}));
        }
        break;
      }
      case NoteActionTypes.RenameNote: {
        if (this.node_selected) {
          if (index >= 0) {
            this.new_node_name = this.data[index].label;
            this.data[index].label = '';
            this.data[index].selected=false;
            this.getSelected(this.node_selected)
          }
        }
        break;
      }
      case NoteActionTypes.SelectNote: {
        console.log("node selected ")
        break;
      }
      default: {
        //save statements; 
        break;
      }
    }
  }

  addNode(level:number) {
    this.data.push(new NotesNodeImp(level, false));
    this.node_selected = new NotesNodeImp(level, false);
    this.getSelected(this.node_selected)
    setTimeout(() => { // this will make the execution after the above boolean has changed
      (<HTMLInputElement>document.getElementById("note_name_input")).focus();
    }, 0);
  }

  renameNode() {
    let selected = this.data.find(ren_node => ren_node.label == '');
    if( this.new_node_name == ''){
      selected.setLabel('Note_'+this.getFormattedDate());
    }else{
      selected.setLabel(this.new_node_name);
      this.new_node_name = '';
    }
    this.store_service.dispatch( new RenameNote({note: this.node_selected}));
    selected.selected = false;
    this.getSelected(selected);
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

}

