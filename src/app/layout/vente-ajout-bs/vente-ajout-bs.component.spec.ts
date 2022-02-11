import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteAjoutBSComponent } from './vente-ajout-bs.component';

describe('VenteAjoutBSComponent', () => {
  let component: VenteAjoutBSComponent;
  let fixture: ComponentFixture<VenteAjoutBSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteAjoutBSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteAjoutBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
