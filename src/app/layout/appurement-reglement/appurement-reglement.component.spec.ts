import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppurementReglementComponent } from './appurement-reglement.component';

describe('AppurementReglementComponent', () => {
  let component: AppurementReglementComponent;
  let fixture: ComponentFixture<AppurementReglementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppurementReglementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppurementReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
