import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleOffreRgMgComponent } from './nouvelle-offre-rg-mg.component';

describe('NouvelleOffreRgMgComponent', () => {
  let component: NouvelleOffreRgMgComponent;
  let fixture: ComponentFixture<NouvelleOffreRgMgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvelleOffreRgMgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleOffreRgMgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
