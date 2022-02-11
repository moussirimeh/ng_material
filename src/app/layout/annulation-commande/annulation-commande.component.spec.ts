import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationCommandeComponent } from './annulation-commande.component';

describe('AnnulationCommandeComponent', () => {
  let component: AnnulationCommandeComponent;
  let fixture: ComponentFixture<AnnulationCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnulationCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulationCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
