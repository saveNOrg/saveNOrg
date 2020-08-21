import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree'; 
import { NotesActionService } from "../../service/notes-action.service";
import { NotesTreeDataSource, NotesNode } from './notes-tree-datasource';
import { SelectedNodeService } from '../../service/selected-node.service';

@Component({
  selector: 'app-notes-tree',
  templateUrl: './notes-tree.component.html',
  styleUrls: ['./notes-tree.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class NotesTreeComponent implements OnInit {

  message:string='';
  new_node_name:string='';
  node_selected:NotesNode;
  @Input() data:NotesNode[]=[{name:'', level:1}];
  dataSource:NotesTreeDataSource;
  


  constructor(private action_service: NotesActionService,
              private select_service: SelectedNodeService) {
    this.dataSource = new NotesTreeDataSource();
  }

  ngOnInit(){
    this.action_service.currentMessage.subscribe(
      message => {
        this.message = message
        console.log("action: ", this.message)
        this.exec_action(this.message);
      }
    );
    this.select_service.currentNode.subscribe(node => this.node_selected = node)
  }

  getSelected(event){
    event.selected = !event.selected ;
    console.log("event ", event)
    this.select_service.changeSelectedNode(event);
  }

  exec_action(action:string){
    switch(action) { 
      case 'add': { 

         if( this.node_selected ){
          let index = this.data.findIndex(node => node.name == this.node_selected.name && node.level == this.node_selected.level);
          if( index >= 0 ){
            if( !this.data[index].children ){
              this.data[index].children =[]
            }
            this.data[index].children.push({ name: "" , level:this.node_selected.level+1, selected: true });
            this.node_selected = { name: "" , level:this.node_selected.level+1, selected: true };
            setTimeout(()=>{ // this will make the execution after the above boolean has changed
              (<HTMLInputElement>document.getElementById("note_name_input")).focus();
            },0);  
          }
         }

         break; 
      } 
      case 'delete': { 
         //statements; 
         break; 
      } 
      default: { 
         //save statements; 
         break; 
      } 
   } 
  }

  find_parent(){
    
  }

  renameNode(){
    console.log("event ", this.data)
    let selected = this.data.find(ren_node => ren_node.name == '');
    selected.name = this.new_node_name;
    selected.selected = false;
    this.getSelected( selected );
  }

}

