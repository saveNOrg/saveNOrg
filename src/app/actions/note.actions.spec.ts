import * as fromNote from './note.actions';

describe('loadNotes', () => {
  it('should return an action', () => {
    expect(fromNote.loadNotes().type).toBe('[Note] Load Notes');
  });
});
