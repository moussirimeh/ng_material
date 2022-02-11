import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatOffreEnvoyeComponent } from './etat-offre-envoye.component';

describe('EtatOffreEnvoyeComponent', () => {
  let component: EtatOffreEnvoyeComponent;
  let fixture: ComponentFixture<EtatOffreEnvoyeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatOffreEnvoyeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatOffreEnvoyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
