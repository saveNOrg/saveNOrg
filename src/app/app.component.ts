import { Component, OnInit, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NotesNodeImp } from './utils/NotesNodeImp';
import { Tab } from './utils/interfaces';
import { BaseDirService } from './service/baseDir.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'myLifeNotes';
  NOTES_DATA: NotesNodeImp[] = [];

  tabs: Tab[] = [];
  /*
  [{
    name: 'Welcome',
    id: this.getFileId(),
    order: 0,
    icon: 'none'
  }, {
    name: 'Work',
    id: this.getFileId() + 'W',
    order: 1,
    icon: 'none'
  }, {
    name: 'Technical',
    id: this.getFileId() + 'T',
    order: 2,
    icon: 'none'
  }, {
    name: 'Add',
    id: '0',
    order: 3,
    icon: 'none'
  }];
  */
  selected = new FormControl(0);
  renamingTabId: string = '';
  renamingTabName: string = '';
  baseDir: string = '';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(public zone: NgZone,
              private baseDirService: BaseDirService) {
  }

  ngOnInit() {
    this.baseDirService.baseDirMetadata.pipe(takeUntil(this.destroy$))
    .subscribe((baseDirMetadata:any) =>{
      if( baseDirMetadata.extra && baseDirMetadata.extra['tabs'] &&
      baseDirMetadata.extra['tabs'].length > 0  ){
        let firstTab ={
          name: baseDirMetadata.extra['tabs'][0]['name'],
          id: baseDirMetadata.extra['tabs'][0]['id'],
          order: 0 , 
          icon: ''
        }
        this.tabs.push(firstTab)
      }
      console.log( "baseDirMetadata ", baseDirMetadata)

    })
    // this.baseDirService.baseDir.pipe(takeUntil(this.destroy$))
    //   .subscribe((sourceBaseDir: string) => this.baseDir = sourceBaseDir);
    // this.electron_service.notes.pipe(takeUntil(this.destroy$))
    //   .subscribe(notes => {

    //     notes.forEach(note => {
    //       let name_parts = note.split('-');
    //       let notesObj = new NotesNodeImp(Number.parseInt(name_parts[0]));
    //       notesObj.name = note;
    //       notesObj.label = name_parts[1];
    //       this.NOTES_DATA.push(notesObj);
    //     });
    //     this.zone.run(() => this.NOTES_DATA);
    //   })

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTab(selectAfterAdding: boolean) {
    let newTab: Tab = {
      name: 'New',
      id: this.getFileId(),
      order: this.tabs.length,
      icon: 'none'
    }
    this.tabs.splice(this.tabs.length - 1, 0, newTab);

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
    //TODO Service to update tabs file
  }

  deleteTab(tab: Tab) {
    let index = this.tabs.findIndex(it => it.id == tab.id)
    this.tabs.splice(index, 1);
    //TODO 
    //Service to update tabs file
  }

  renameTab(tab: Tab) {
    this.renamingTabId = tab.id
    this.renamingTabName = tab.name
  }

  setTabName() {
    let index = this.tabs.findIndex(it => it.id == this.renamingTabId)
    this.tabs[index].name = this.renamingTabName
    this.renamingTabId = ''
    //TODO 
    //Service to update tabs file
  }

  loadTabData(tab: Tab) {
    console.log("Loading Tab data")
    //TODO
    //Service to load tab data
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
