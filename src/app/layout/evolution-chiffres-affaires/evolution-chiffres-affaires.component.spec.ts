import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionChiffresAffairesComponent } from './evolution-chiffres-affaires.component';

describe('EvolutionChiffresAffairesComponent', () => {
  let component: EvolutionChiffresAffairesComponent;
  let fixture: ComponentFixture<EvolutionChiffresAffairesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvolutionChiffresAffairesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolutionChiffresAffairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
