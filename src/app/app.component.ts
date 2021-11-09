import { Component, OnInit, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NotesNodeImp } from './utils/NotesNodeImp';
import { ResizeEvent } from 'angular-resizable-element';
import { ElectronServiceFile } from './service/electron.service.files';
import { Tab } from './utils/interfaces';

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { getgid } from 'process';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'myLifeNotes';
  NOTES_DATA: NotesNodeImp[] = [];

  tabs: Tab[] = [{
    name: 'Welcome',
    id: this.getFileId(),
    order: 0,
    icon: 'none'
  }, {
    name: 'Work',
    id: this.getFileId()+'W',
    order: 1,
    icon: 'none'
  }, {
    name: 'Technical',
    id: this.getFileId()+'T',
    order: 2,
    icon: 'none'
  }, {
    name: 'Add',
    id: '0',
    order: 3,
    icon: 'none'
  }];
  selected = new FormControl(0);
  renamingTabId:string=''
  renamingTabName:string=''

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.electron_service.notes.pipe(takeUntil(this.destroy$))
      .subscribe(notes => {

        notes.forEach(note => {
          let name_parts = note.split('-');
          let notesObj = new NotesNodeImp(Number.parseInt(name_parts[0]));
          notesObj.name = note;
          notesObj.label = name_parts[1];
          this.NOTES_DATA.push(notesObj);
        });
        this.zone.run(() => this.NOTES_DATA);
      })

  }


  constructor(private electron_service: ElectronServiceFile,
    public zone: NgZone) {
    this.electron_service.loadFiles();

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTab(selectAfterAdding: boolean) {
    let newTab:Tab={
      name:'New',
      id: this.getFileId(),
      order: this.tabs.length,
      icon:'none'
    }
    this.tabs.splice(this.tabs.length-1,0, newTab);

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
    //TODO Service to update tabs file
  }

  deleteTab(tab:Tab) {
    let index = this.tabs.findIndex( it => it.id == tab.id)
    this.tabs.splice(index, 1);
    //TODO 
    //Service to update tabs file
  }

  renameTab(tab:Tab){
    this.renamingTabId = tab.id
    this.renamingTabName = tab.name
  }

  setTabName(){
    let index = this.tabs.findIndex( it => it.id == this.renamingTabId)
    this.tabs[index].name = this.renamingTabName
    this.renamingTabId=''
    //TODO 
    //Service to update tabs file
  }

  getFileId(): string {
    let now = new Date();
    let id: string = now.getFullYear() + '' +
        now.getMonth() + '' +
        now.getDate() + '' +
        now.getHours() + '' +
        now.getMinutes() + '' +
        now.getSeconds();
    return id;
}

}
