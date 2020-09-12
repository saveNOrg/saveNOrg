import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NotesActionService } from "../../service/notes-action.service";
import { SelectedNodeService } from '../../service/selected-node.service';
import { NotesNodeImp } from '../../utils/notes-node';
import { ElectronService } from '../../service/electron.service.data';

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
    console.log("data1 " , d)
    this.data = d;
  }


  constructor(private action_service: NotesActionService,
    private select_service: SelectedNodeService,
    private os_service: ElectronService) {
  }

  ngOnInit() {
    this.action_service.currentMessage.subscribe(
      message => {
        this.message = message
        console.log("action: ", this.message)
        this.exec_action(this.message);
      }
    );
    this.select_service.currentNode.subscribe(node => this.node_selected = node)
  }

  getSelected(event) {
    event.selected = !event.selected;
    console.log("getSelected ", event)
    this.select_service.changeSelectedNode(event);
    this.os_service.getNote(event.name);
  }



  exec_action(action: string) {
    switch (action) {
      case 'add': {
        console.log("adding ", this.node_selected)

        if (this.data.length == 0 && this.node_selected == null) {
          this.addNode(1);
        } else {
          if (this.node_selected) {
            let index = this.data.findIndex(node => node.name == this.node_selected.name && node.level == this.node_selected.level);
            if (index >= 0) {
              if (!this.data[index].children) {
                this.data[index].children = []
              }
              this.addNode(this.node_selected.level + 1); 
            }
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

  addNode(level:number) {
    this.data.push(new NotesNodeImp(level, false));
    this.node_selected = new NotesNodeImp(level, false);
    this.getSelected(this.node_selected)
    setTimeout(() => { // this will make the execution after the above boolean has changed
      (<HTMLInputElement>document.getElementById("note_name_input")).focus();
    }, 0);
  }

  renameNode() {
    console.log("event ", this.data)
    let selected = this.data.find(ren_node => ren_node.label == '');
    selected.setLabel(this.new_node_name);
    selected.selected = false;
    this.getSelected(selected);
  }

}

