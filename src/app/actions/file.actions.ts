import { Action } from '@ngrx/store';
import { NotesNodeImp } from '../utils/NotesNodeImp';

export enum FileActionTypes {
  LoadFile = '[File] Load File',
  DirtyFile = '[File] Dirty File',
  SaveFile = '[File] Safe File',
  DeleteFile = '[File] Delete File'
}

export class FileAction implements Action {
  type: string;
  payload: {
    file: NotesNodeImp,
    data: any
  };
}

export class LoadFile implements Action {
  readonly type = FileActionTypes.LoadFile;

  constructor(readonly payload: {file: NotesNodeImp, data:any}) {

  }
}

export class DirtyFile implements Action {
  readonly type = FileActionTypes.DirtyFile;

  constructor(readonly payload: {file: NotesNodeImp, data:any}) {

  }
}

export class SaveFile implements Action {
  readonly type = FileActionTypes.SaveFile;

  constructor(readonly payload: {file: NotesNodeImp, data:any}) {

  }
}

export class DeleteFile implements Action {
  readonly type = FileActionTypes.DeleteFile;

  constructor(readonly payload: {file: NotesNodeImp, data:any}) {

  }
}

export type ActionsUnion = LoadFile | DirtyFile | SaveFile | DeleteFile;