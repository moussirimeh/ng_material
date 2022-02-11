import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteRaportLivraisonComponent } from './vente-raport-livraison.component';

describe('VenteRaportLivraisonComponent', () => {
  let component: VenteRaportLivraisonComponent;
  let fixture: ComponentFixture<VenteRaportLivraisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteRaportLivraisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteRaportLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
