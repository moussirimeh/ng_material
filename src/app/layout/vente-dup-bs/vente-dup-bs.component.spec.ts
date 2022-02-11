import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteDupBsComponent } from './vente-dup-bs.component';

describe('VenteDupBsComponent', () => {
  let component: VenteDupBsComponent;
  let fixture: ComponentFixture<VenteDupBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteDupBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteDupBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
