import { TestBed } from '@angular/core/testing';

import { SelectedNodeService } from './selected-node.service';

describe('SelectedNodeService', () => {
  let service: SelectedNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
