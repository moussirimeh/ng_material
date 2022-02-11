import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatinventaireComponent } from './etatinventaire.component';

describe('EtatinventaireComponent', () => {
  let component: EtatinventaireComponent;
  let fixture: ComponentFixture<EtatinventaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatinventaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatinventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
