import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleCaisseSecondaireComponent } from './feuille-caisse-secondaire.component';

describe('FeuilleCaisseSecondaireComponent', () => {
  let component: FeuilleCaisseSecondaireComponent;
  let fixture: ComponentFixture<FeuilleCaisseSecondaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeuilleCaisseSecondaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeuilleCaisseSecondaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
