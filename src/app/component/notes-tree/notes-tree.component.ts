import { Component, OnInit, Injectable } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree'; 
import { NotesActionService } from "../../service/notes-action.service";

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface NoteNode {
  name: string;
  level: number;
  children?: NoteNode[];
}


@Component({
  selector: 'app-notes-tree',
  templateUrl: './notes-tree.component.html',
  styleUrls: ['./notes-tree.component.scss']
})
export class NotesTreeComponent implements OnInit {

  message:string='';
  new_node_name:string='';
  node_selected:NoteNode;
  TREE_DATA: NoteNode[] = [
    {
      name: 'Fruit',
      level: 0,
      children: [
        {name: 'Apple', level: 1},
        {name: 'Banana', level: 1},
        {name: 'Fruit loops', level: 1},
      ]
    }, {
      name: 'Vegetables',
      level: 0,
      children: [
        {
          name: 'Green', level: 1,
          children: [
            {name: 'Broccoli', level: 2},
            {name: 'Brussels sprouts', level: 2},
          ]
        }, {
          name: 'Orange', level: 1,
          children: [
            {name: 'Pumpkins', level: 2},
            {name: 'Carrots', level: 2},
          ]
        },
      ]
    },
  ];

  treeControl = new NestedTreeControl<NoteNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<NoteNode>();

  constructor(private action_service: NotesActionService) {
    this.dataSource.data = this.TREE_DATA;
  }

  hasChild = (_: number, node: NoteNode) => !!node.children && node.children.length > 0;

  ngOnInit(){
    this.action_service.currentMessage.subscribe(
      message => {
        this.message = message
        console.log("action: ", this.message)
        this.exec_action(this.message);
      }
    );
  }

  getSelected(event){
    console.log("Tree selected ", event)
    this.node_selected = event;
  }

  exec_action(action:string){
    switch(action) { 
      case 'add': { 
         if( this.node_selected.children.length > 0 ){
           this.node_selected.children.push({name:'',level:this.node_selected.level+1});
         }else{
           let parent_node = this.node_selected.level - 1;
          this.node_selected.children.push({name:'',level:this.node_selected.level+1});
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

}

