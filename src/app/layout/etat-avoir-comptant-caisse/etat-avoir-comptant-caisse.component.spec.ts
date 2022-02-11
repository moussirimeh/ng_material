import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatAvoirComptantCaisseComponent } from './etat-avoir-comptant-caisse.component';

describe('EtatAvoirComptantCaisseComponent', () => {
  let component: EtatAvoirComptantCaisseComponent;
  let fixture: ComponentFixture<EtatAvoirComptantCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatAvoirComptantCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatAvoirComptantCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
