import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApurementRegtsCmptComponent } from './apurement-regts-cmpt.component';

describe('ApurementRegtsCmptComponent', () => {
  let component: ApurementRegtsCmptComponent;
  let fixture: ComponentFixture<ApurementRegtsCmptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApurementRegtsCmptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApurementRegtsCmptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
