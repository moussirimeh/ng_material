import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesSecuriteComponent } from './acces-securite.component';

describe('AccesSecuriteComponent', () => {
  let component: AccesSecuriteComponent;
  let fixture: ComponentFixture<AccesSecuriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesSecuriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesSecuriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
