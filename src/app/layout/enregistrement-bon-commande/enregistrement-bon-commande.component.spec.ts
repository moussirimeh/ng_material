import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrementBonCommandeComponent } from './enregistrement-bon-commande.component';

describe('EnregistrementBonCommandeComponent', () => {
  let component: EnregistrementBonCommandeComponent;
  let fixture: ComponentFixture<EnregistrementBonCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnregistrementBonCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnregistrementBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
