import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesTreeComponent } from './notes-tree.component';

describe('NotesTreeComponent', () => {
  let component: NotesTreeComponent;
  let fixture: ComponentFixture<NotesTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
