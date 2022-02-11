import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangementreferenceComponent } from './changementreference.component';

describe('ChangementreferenceComponent', () => {
  let component: ChangementreferenceComponent;
  let fixture: ComponentFixture<ChangementreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangementreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangementreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
