import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationCommandeComponent } from './modification-commande.component';

describe('ModificationCommandeComponent', () => {
  let component: ModificationCommandeComponent;
  let fixture: ComponentFixture<ModificationCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
