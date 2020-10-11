import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { NotesNodeImp } from '../utils/notes-node';
import { NoteActionTypes, NoteAction } from '../actions/note.actions';
import { FileActionTypes, FileAction } from '../actions/file.actions';


export interface NoteState {
  note: NotesNodeImp | null,
  type: string | null
}

const initialNoteState: NoteState = {
  note: null,
  type: null
};

export interface FileState {
  file: NotesNodeImp | null,
  data: any,
  type: string | null
}

const initialFileState: FileState = {
  file: null,
  data: null,
  type: null
};

export interface AppState {
  note: NoteState;
  file: FileState;
}

export function NotesReducer(state: NoteState = initialNoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case NoteActionTypes.SelectNote:
      return {
        note: action.payload.note,
        type: action.type
      };
    case NoteActionTypes.RenameNote:
      return {
        note: action.payload.note,
        type: action.type
      };
    case NoteActionTypes.DeleteNote:
      return {
        note: action.payload.note,
        type: action.type
      };
    case NoteActionTypes.AddNote:
      return {
        note: action.payload.note,
        type: action.type
      };
    default:
      return state;
  }
}

export function FilesReducer(state: FileState = initialFileState, action: FileAction): FileState {
  switch (action.type) {
    case FileActionTypes.LoadFile:
      return {
        file: action.payload.file,
        data: action.payload.data,
        type: action.type
      };
    case FileActionTypes.DirtyFile:
      return {
        file: action.payload.file,
        data: action.payload.data,
        type: action.type
      };
    case FileActionTypes.SaveFile:
      return {
        file: action.payload.file,
        data: action.payload.data,
        type: action.type
      };
    case FileActionTypes.DeleteFile:
      return {
        file: action.payload.file,
        data: action.payload.data,
        type: action.type
      };
    default:
      return state;
  }
}

export const reducers: ActionReducerMap<AppState> = {
  note: NotesReducer,
  file: FilesReducer
};


export const noteSelector = (state: AppState) => state.note;

export const fileSelector = (state: AppState) => state.file;

export const metaReducers: MetaReducer<any>[] = !environment.production ? [] : [];
