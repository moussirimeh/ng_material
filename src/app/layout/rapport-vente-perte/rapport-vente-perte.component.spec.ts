import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportVentePerteComponent } from './rapport-vente-perte.component';

describe('RapportVentePerteComponent', () => {
  let component: RapportVentePerteComponent;
  let fixture: ComponentFixture<RapportVentePerteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportVentePerteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportVentePerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
