import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsAnnApurtsCmptComponent } from './cons-ann-apurts-cmpt.component';

describe('ConsAnnApurtsCmptComponent', () => {
  let component: ConsAnnApurtsCmptComponent;
  let fixture: ComponentFixture<ConsAnnApurtsCmptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsAnnApurtsCmptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsAnnApurtsCmptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
