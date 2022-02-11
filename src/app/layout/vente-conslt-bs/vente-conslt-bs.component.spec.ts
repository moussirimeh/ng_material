import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteConsltBsComponent } from './vente-conslt-bs.component';

describe('VenteConsltBsComponent', () => {
  let component: VenteConsltBsComponent;
  let fixture: ComponentFixture<VenteConsltBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteConsltBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteConsltBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
