import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDesVisitesComponent } from './validation-des-visites.component';

describe('ValidationDesVisitesComponent', () => {
  let component: ValidationDesVisitesComponent;
  let fixture: ComponentFixture<ValidationDesVisitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationDesVisitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationDesVisitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
