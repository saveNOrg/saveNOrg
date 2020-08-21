import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotesNode } from '../component/notes-tree/notes-tree-datasource'

@Injectable({
  providedIn: 'root'
})
export class SelectedNodeService {

  private selectionNode = new BehaviorSubject<NotesNode>(null);
  currentNode = this.selectionNode.asObservable();

  constructor() { }

  changeSelectedNode(selected_node: NotesNode) {
    this.selectionNode.next(selected_node)
  }
}
