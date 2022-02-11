import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptabiliteReglementFournisseurComponent } from './comptabilite-reglement-fournisseur.component';

describe('ComptabiliteReglementFournisseurComponent', () => {
  let component: ComptabiliteReglementFournisseurComponent;
  let fixture: ComponentFixture<ComptabiliteReglementFournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComptabiliteReglementFournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptabiliteReglementFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
