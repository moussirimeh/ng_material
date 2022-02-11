import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaionActionRecouvrementComponent } from './consultaion-action-recouvrement.component';

describe('ConsultaionActionRecouvrementComponent', () => {
  let component: ConsultaionActionRecouvrementComponent;
  let fixture: ComponentFixture<ConsultaionActionRecouvrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaionActionRecouvrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaionActionRecouvrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
