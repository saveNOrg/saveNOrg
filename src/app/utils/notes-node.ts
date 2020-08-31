import { NotesNode } from './model'

/*
* 
*/
export class NotesNodeImp implements NotesNode{
    name: string;
    level: number;
    label?: string;
    selected?:boolean;
    children?: NotesNode[];

    constructor(level:number, selected:boolean=false){
        this.level = level;
        this.name =this.level + '--' + String(Date.now());
        this.label = '';
        this.selected = selected;
    }

    setLabel(label: string){
        this.label = label;
        let name_parts = this.name.split('-'); 
        this.name = name_parts[0]+'-'+label+'-'+name_parts[2];
        console.log("set label ", this.label +"."+this.name)
    }

  }