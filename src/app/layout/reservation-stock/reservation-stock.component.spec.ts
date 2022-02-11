import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationStockComponent } from './reservation-stock.component';

describe('ReservationStockComponent', () => {
  let component: ReservationStockComponent;
  let fixture: ComponentFixture<ReservationStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
