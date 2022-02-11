import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatAvoirComptantComponent } from './etat-avoir-comptant.component';

describe('EtatAvoirComptantComponent', () => {
  let component: EtatAvoirComptantComponent;
  let fixture: ComponentFixture<EtatAvoirComptantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatAvoirComptantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatAvoirComptantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
