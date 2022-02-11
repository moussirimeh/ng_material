import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteBsfermesComponent } from './vente-bsfermes.component';

describe('VenteBsfermesComponent', () => {
  let component: VenteBsfermesComponent;
  let fixture: ComponentFixture<VenteBsfermesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteBsfermesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteBsfermesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
