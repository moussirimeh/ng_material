import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatParamtresComponent } from './etat-paramtres.component';

describe('EtatParamtresComponent', () => {
  let component: EtatParamtresComponent;
  let fixture: ComponentFixture<EtatParamtresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatParamtresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatParamtresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
