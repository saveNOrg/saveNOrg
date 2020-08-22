import { Component } from '@angular/core';
import { NotesNode } from './component/notes-tree/notes-tree-datasource';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myLifeNotes';
  public style: object = {};
  NOTES_DATA: NotesNode[] = [];
  /*[
    {
      name: 'Fruit',
      level:1,
      children: [
        {name: 'Apple', level:2},
        {name: 'Banana', level:2 },
        {name: 'Fruit loops', level:2},
      ]
    }, {
      name: 'Vegetables', level:1,
      children: [
        {
          name: 'Green', level:2, 
          children: [
            {name: 'Broccoli', level:3 },
            {name: 'Brussels sprouts', level:3},
          ]
        }, {
          name: 'Orange', level:2, 
          children: [
            {name: 'Pumpkins', level:3},
            {name: 'Carrots', level:3},
          ]
        },
      ]
    },
  ]; */
  onResizeEnd(event: ResizeEvent): void {

    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }
}
