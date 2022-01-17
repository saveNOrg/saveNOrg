import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NotesNodeImp } from '../../utils/NotesNodeImp';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { ElectronDataService } from '../../service/electron.data.service';
import { DataService } from '../../service/data.service';
import { DataState } from '../../utils/interfaces';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit, OnDestroy {

  message: string = '';
  node_selected: NotesNodeImp = null;
  search_keyword: string = '';
  base_dir: string = '';
  match_notes: string[] = [];
  match_index: number = 0;
  baseDir: string = '';
  editBaseDir: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('baseDirElement') baseDirElement:ElementRef;


  constructor(private os_service: ElectronDataService,
    private dataService: DataService) { }
  

  ngOnInit(): void {
    this.dataService.stateDataObservable.pipe(takeUntil(this.destroy$))
      .subscribe((data: DataState) => {
        if( data.base_dir ){
          this.baseDir = data.base_dir;
        }
      });
  }

  previous() {
    let index = this.match_notes.findIndex(note_name => this.node_selected.name == note_name);
    if (index == 0) {
      this.match_index = this.match_notes.length - 1;
    } else {
      this.match_index = index - 1;
    }
  }

  next() {
    let index = this.match_notes.findIndex(note_name => this.node_selected.name == note_name);
    if (index == this.match_notes.length - 1) {
      this.match_index = 0;
    } else {
      this.match_index = index + 1;
    }
  }

  search() {
    this.os_service.searchNotes(this.search_keyword);
  }

  updateBaseDir() {
    this.editBaseDir = true;
    this.baseDirElement.nativeElement.focus();
  }

  setBaseDir() {
    this.editBaseDir = false;
    this.dataService.setWorkspaceDir(this.baseDir);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
