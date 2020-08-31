import { CheckboxControlValueAccessor } from '@angular/forms';
import { NotesNode } from '../../utils/model';
import { NotesNodeImp } from '../../utils/notes-node';

export class NotesTreeDataSource {
  
  /* Initial value with no children */
  _data:NotesNode={ name: "Dummy Root", level:0 };
  
  constructor() {  }

  getNodes4Level(level:number, node:NotesNode, return_node:NotesNode[]=[]):NotesNode[]{
    
    if( node.level == level ){
      return_node = [...return_node , node];
    }else if( node.level < level ){
      if( node.children ) {
        for(let i = 0 ; i < node.children.length; i++){
          let child_node = this.getNodes4Level( level, node.children[i], return_node);
          if( child_node.length > 0 ){
            return_node = Object.assign(return_node , child_node);
          } 
        }
      }
    }else{
      return [];
    }
    return return_node;
  }

  addNode(parent_node:NotesNode, add_node:NotesNode, traversed_node:NotesNode=this._data):boolean{
    if( parent_node.level == traversed_node.level && parent_node.name == traversed_node.name){
      
      if(! traversed_node.children){
        traversed_node.children = []
      }
      traversed_node.children.push(add_node);
      return true;

    }else if( traversed_node.level < parent_node.level ){
      if( traversed_node.children ) {
        for(let i = 0 ; i < traversed_node.children.length; i++){
          let child_node = this.addNode( parent_node, add_node, traversed_node.children[i]);
          if( child_node  ){
            return true;
          } 
        }
      }
    }else{
      return false;
    }
    
  }

  removeNode(parent_node:NotesNode, remove_node:NotesNode, traversed_node:NotesNode=this._data):boolean{
    return this.replaceNode(
      parent_node,
      remove_node,
      remove_node,
      traversed_node,
      'remove'
    );
  }

  replaceNode(parent_node:NotesNode, from_node:NotesNode, to_node:NotesNode, traversed_node:NotesNode=this._data, action:string='remove'):boolean{
    if( parent_node.level == traversed_node.level && 
        parent_node.name == traversed_node.name &&
        traversed_node.children){
      
      let index = traversed_node.children.findIndex(node => node.name == from_node.name );
      if( index >= 0 ){
        if(action === 'remove'){
          traversed_node.children.splice(index);
        }else{
          traversed_node.children[index] = to_node;
        }
      }
      return true;

    }else if( traversed_node.level < parent_node.level ){
      if( traversed_node.children ) {
        for(let i = 0 ; i < traversed_node.children.length; i++){
          let child_node = this.replaceNode( parent_node, from_node, to_node, traversed_node.children[i], action);
          if( child_node  ){
            return true;
          } 
        }
      }
    }else{
      return false;
    }
    
  }

}