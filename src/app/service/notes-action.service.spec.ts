import { TestBed } from '@angular/core/testing';

import { NotesActionService } from './notes-action.service';

describe('NotesActionService', () => {
  let service: NotesActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
