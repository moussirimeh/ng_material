import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentFermBsComponent } from './vent-ferm-bs.component';

describe('VentFermBsComponent', () => {
  let component: VentFermBsComponent;
  let fixture: ComponentFixture<VentFermBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentFermBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentFermBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
