import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationRegFourComponent } from './consultation-reg-four.component';

describe('ConsultationRegFourComponent', () => {
  let component: ConsultationRegFourComponent;
  let fixture: ComponentFixture<ConsultationRegFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationRegFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationRegFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
