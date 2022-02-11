import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteRapportbsComponent } from './vente-rapportbs.component';

describe('VenteRapportbsComponent', () => {
  let component: VenteRapportbsComponent;
  let fixture: ComponentFixture<VenteRapportbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteRapportbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteRapportbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
