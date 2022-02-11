import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationreferenceComponent } from './consultationreference.component';

describe('ConsultationreferenceComponent', () => {
  let component: ConsultationreferenceComponent;
  let fixture: ComponentFixture<ConsultationreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
