import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { DataService } from '../../service/data.service';
import { DataState, NotesNode } from '../../utils/interfaces';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { stat } from 'fs';

@Component({
  selector: 'app-notes-tree',
  templateUrl: './notesTree.component.html',
  styleUrls: ['./notesTree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesTreeComponent implements OnInit {

  new_node_name: string = '';
  data: NotesNode[]=[];

  node_selected: NotesNodeImp=null;
  private note_content:any=null;

  private destroy$: Subject<void> = new Subject<void>();

  tab_id:string='';

  @Input('data_saved') 
  set data_saved (d: NotesNodeImp[]){
    //this.data = d;
  }

  constructor(private dataService:DataService ) {
  }

  ngOnInit() {

    this.dataService.stateDataObservable.pipe(takeUntil(this.destroy$))
      .subscribe((data: DataState) => {
        if( data.current_tab_id ){
          this.tab_id = data.current_tab_id;
        }
        if( data.current_tab_notes_metadata ){
          this.data = data.current_tab_notes_metadata;
        }
        if( data.current_note_id ){
          let selected_note = data.current_tab_notes_metadata.find( note =>{
            return note.name == data.current_note_id;
          })
          this.node_selected = new NotesNodeImp(selected_note.level,true);
        }
      });

  }

  
  exec_action(action: string) {
    let index = this.data.findIndex(node => node.name == this.node_selected.name && node.level == this.node_selected.level);
          
    // switch (action) {
    //   case NoteActionTypes.AddNote: {

    //     if (this.data.length == 0 && this.node_selected == null) {
    //       this.addNode(1);
    //     } else {
    //       this.addNode(this.node_selected.level);
    //       //Add children
    //       // if (!this.data[index].children) {
    //           //   this.data[index].children = []
    //           // }
    //       //}
    //     }

    //     break;
    //   };
    //   case NoteActionTypes.DeleteNote: {
    //     if (index >= 0) {
    //       this.data.splice(index, 1);
    //       this.store_service.dispatch(new DeleteFile({file: this.node_selected, data: {"ops":[]} } ));
    //       this.node_selected = null;
    //     }
    //     break;
    //   };
    //   case NoteActionTypes.ClearNameNote: {
    //     this.renameNode();
    //     break;
    //   };
    //   case NoteActionTypes.RenameNote: {

    //     this.selectNode(this.node_selected)
    //     break;
    //   };
    //   case NoteActionTypes.SelectNote: {
        
    //     break;
    //   };
    //   default: {
    //     console.log("nav default") 
    //     break;
    //   };
    // }
  }

  selectNode(devent: NotesNodeImp) {
    let event = Object.assign({}, devent);
    event.selected = !event.selected;
    //Only fire when the new node selected is different
    //than the previous node selected
    if( this.node_selected && this.node_selected.label != event.label){
      //this.store_service.dispatch( new SaveFile({file: this.node_selected, data: this.note_content}))
      //this.store_service.dispatch(new SelectNote({note: event}));
    }
    //this.store_service.dispatch(new SelectNote({note: event}));
  }

  addNode(level:number) {
    if( this.node_selected && this.node_selected.label != "" ){
      //this.store_service.dispatch( new SaveFile({file: this.node_selected, data: this.note_content}))
    }

    this.data.push(new NotesNodeImp(level, true));
    this.node_selected = new NotesNodeImp(level, true);
    //this.store_service.dispatch(new SelectNote({note: this.node_selected}));
    setTimeout(() => { // this will make the execution after the above boolean has changed
      (<HTMLInputElement>document.getElementById("note_name_input")).focus();
    }, 0);
  }

  setNodeName() {
    let selected = this.data.findIndex(ren_node => ren_node.label == '');
    if( this.new_node_name == ''){
      this.data[selected].label= 'Note_'+this.getFormattedDate();
    }else{
      this.data[selected].label =this.new_node_name;
      this.new_node_name = '';
    }

    this.data[selected].selected = true;
  
    //this.store_service.dispatch( new RenameNote({note: this.data[selected]}));
  }

  renameNode(){
    let index_selected = this.data.findIndex(ren_node => ren_node.label == this.node_selected.label);
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

