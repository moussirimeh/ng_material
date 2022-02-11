import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteConsLivraisonComponent } from './vente-cons-livraison.component';

describe('VenteConsLivraisonComponent', () => {
  let component: VenteConsLivraisonComponent;
  let fixture: ComponentFixture<VenteConsLivraisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteConsLivraisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteConsLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
