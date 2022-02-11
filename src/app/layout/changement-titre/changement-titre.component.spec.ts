import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangementTitreComponent } from './changement-titre.component';

describe('ChangementTitreComponent', () => {
  let component: ChangementTitreComponent;
  let fixture: ComponentFixture<ChangementTitreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangementTitreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangementTitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
