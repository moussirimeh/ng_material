import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteBSOuvertsComponent } from './vente-bsouverts.component';

describe('VenteBSOuvertsComponent', () => {
  let component: VenteBSOuvertsComponent;
  let fixture: ComponentFixture<VenteBSOuvertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteBSOuvertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteBSOuvertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
