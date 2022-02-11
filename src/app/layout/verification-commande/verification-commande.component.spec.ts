import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCommandeComponent } from './verification-commande.component';

describe('VerificationCommandeComponent', () => {
  let component: VerificationCommandeComponent;
  let fixture: ComponentFixture<VerificationCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
