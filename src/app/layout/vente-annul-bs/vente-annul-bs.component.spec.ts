import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteAnnulBsComponent } from './vente-annul-bs.component';

describe('VenteAnnulBsComponent', () => {
  let component: VenteAnnulBsComponent;
  let fixture: ComponentFixture<VenteAnnulBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteAnnulBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteAnnulBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
