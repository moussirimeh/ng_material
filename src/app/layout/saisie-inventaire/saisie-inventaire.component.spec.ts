import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieInventaireComponent } from './saisie-inventaire.component';

describe('SaisieInventaireComponent', () => {
  let component: SaisieInventaireComponent;
  let fixture: ComponentFixture<SaisieInventaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaisieInventaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaisieInventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
