import * as fromFile from './file.actions';

describe('loadFiles', () => {
  it('should return an action', () => {
    expect(fromFile.loadFiles().type).toBe('[File] Load Files');
  });
});
