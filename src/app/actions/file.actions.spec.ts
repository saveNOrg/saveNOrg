import * as fromFile from './file.actions';

describe('loadFiles', () => {
  it('should return an action', () => {
    expect( (new fromFile.LoadFile({file:null, data: {}} )).type ).toBe('[File] Load Files');
  });
});
