import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NoteActionTypes, SelectNote } from '../actions/note.actions';
import { LoadFile } from '../actions/file.actions';

import { ElectronServiceData } from '../service/electron.service.data';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FileEffects {

  @Effect()
  selectNote$ = this.actions$
    .pipe(  
      ofType<SelectNote>(NoteActionTypes.SelectNote),
      mergeMap((action) => {
        this.data_service.getNote(action.payload.note.name);
        
        return this.data_service.data.pipe(
          mergeMap((d) => {
            let data = {"ops":[]};
            if( typeof d === 'string' ) data = JSON.parse( d ) ;
            let payload = {file: action.payload.note, data: data };
            
            return of( new LoadFile( payload ) ) 
          })
        );
        }
      )
  );


  constructor(private actions$: Actions, private data_service: ElectronServiceData ) {}

}
