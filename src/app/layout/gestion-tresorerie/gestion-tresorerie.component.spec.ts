import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTresorerieComponent } from './gestion-tresorerie.component';

describe('GestionTresorerieComponent', () => {
  let component: GestionTresorerieComponent;
  let fixture: ComponentFixture<GestionTresorerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionTresorerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionTresorerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
