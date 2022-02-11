import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheVendeurComponent } from './fiche-vendeur.component';

describe('FicheVendeurComponent', () => {
  let component: FicheVendeurComponent;
  let fixture: ComponentFixture<FicheVendeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheVendeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
