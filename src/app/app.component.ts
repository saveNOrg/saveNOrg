import { Component } from '@angular/core';
import { NotesNode } from './component/notes-tree/notes-tree-datasource';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myLifeNotes';
  TREE_DATA: NotesNode[] = [
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
  ];
}
