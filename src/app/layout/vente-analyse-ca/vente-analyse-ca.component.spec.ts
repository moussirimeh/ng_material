import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteAnalyseCaComponent } from './vente-analyse-ca.component';

describe('VenteAnalyseCaComponent', () => {
  let component: VenteAnalyseCaComponent;
  let fixture: ComponentFixture<VenteAnalyseCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteAnalyseCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteAnalyseCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
