import { Action } from '@ngrx/store';
import { NotesNodeImp } from '../utils/notes-node';

export enum NoteActionTypes {
  AddNote = '[Note] Add Note',
  DeleteNote = '[Note] Delete Note',
  RenameNote = '[Note] Rename Note',
  SelectNote = '[Note] Select Note'
}

export class NoteAction implements Action {
  type: string;
  payload: {
    note: NotesNodeImp
  };
}

export class AddNote implements Action {
  readonly type = NoteActionTypes.AddNote;

  constructor(readonly payload: {note: NotesNodeImp}) {

  }
}

export class DeleteNote implements Action {
  readonly type = NoteActionTypes.DeleteNote;

  constructor(readonly payload: {note: NotesNodeImp}) {

  }
}

export class RenameNote implements Action {
  readonly type = NoteActionTypes.RenameNote;

  constructor(readonly payload: {note: NotesNodeImp}) {

  }
}

export class SelectNote implements Action {
  readonly type = NoteActionTypes.SelectNote;

  constructor(readonly payload: {note: NotesNodeImp}) {

  }
}

export type ActionsUnion = AddNote | RenameNote | DeleteNote | SelectNote;