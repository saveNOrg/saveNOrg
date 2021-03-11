import * as fromNote from './note.actions';

describe('loadNotes', () => {
  it('should return an action', () => {
    expect(new fromNote.AddNote({note: null}).type).toBe('[Note] Load Notes');
  });
});
