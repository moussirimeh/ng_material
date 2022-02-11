import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorisationStockComponent } from './valorisation-stock.component';

describe('ValorisationStockComponent', () => {
  let component: ValorisationStockComponent;
  let fixture: ComponentFixture<ValorisationStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValorisationStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValorisationStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
