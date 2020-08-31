import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotesNodeImp } from '../utils/notes-node';

@Injectable({
  providedIn: 'root'
})
export class SelectedNodeService {

  private selectionNode = new BehaviorSubject<NotesNodeImp>(null);
  currentNode = this.selectionNode.asObservable();

  constructor() { }

  changeSelectedNode(selected_node: NotesNodeImp) {
    this.selectionNode.next(selected_node)
  }
}
