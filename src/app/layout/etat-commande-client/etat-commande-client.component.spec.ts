import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatCommandeClientComponent } from './etat-commande-client.component';

describe('EtatCommandeClientComponent', () => {
  let component: EtatCommandeClientComponent;
  let fixture: ComponentFixture<EtatCommandeClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatCommandeClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatCommandeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
