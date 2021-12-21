import { TestBed } from '@angular/core/testing';

import { ElectronFileService } from './electron.file.service';

describe('ElectronService', () => {
  let service: ElectronFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
