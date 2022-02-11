import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDesVentesComponent } from './rapport-des-ventes.component';

describe('RapportDesVentesComponent', () => {
  let component: RapportDesVentesComponent;
  let fixture: ComponentFixture<RapportDesVentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDesVentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDesVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
