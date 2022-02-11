import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteLivraisonComponent } from './vente-livraison.component';

describe('VenteLivraisonComponent', () => {
  let component: VenteLivraisonComponent;
  let fixture: ComponentFixture<VenteLivraisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteLivraisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
