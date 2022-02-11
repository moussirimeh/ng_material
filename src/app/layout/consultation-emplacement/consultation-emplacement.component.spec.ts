import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationEmplacementComponent } from './consultation-emplacement.component';

describe('ConsultationEmplacementComponent', () => {
  let component: ConsultationEmplacementComponent;
  let fixture: ComponentFixture<ConsultationEmplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationEmplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationEmplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
