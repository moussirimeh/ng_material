import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationRefComponent } from './consultation-ref.component';

describe('ConsultationRefComponent', () => {
  let component: ConsultationRefComponent;
  let fixture: ComponentFixture<ConsultationRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
