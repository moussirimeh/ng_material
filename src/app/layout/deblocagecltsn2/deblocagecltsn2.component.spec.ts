import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Deblocagecltsn2Component } from './deblocagecltsn2.component';

describe('Deblocagecltsn2Component', () => {
  let component: Deblocagecltsn2Component;
  let fixture: ComponentFixture<Deblocagecltsn2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Deblocagecltsn2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Deblocagecltsn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
