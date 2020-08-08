import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDataComponent } from './notes-data.component';

describe('NotesDataComponent', () => {
  let component: NotesDataComponent;
  let fixture: ComponentFixture<NotesDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
