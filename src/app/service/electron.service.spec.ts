import { TestBed } from '@angular/core/testing';

import { ElectronServiceFile } from './electron.service.files';

describe('ElectronService', () => {
  let service: ElectronServiceFile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronServiceFile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
