import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStableComponent } from './stock-stable.component';

describe('StockStableComponent', () => {
  let component: StockStableComponent;
  let fixture: ComponentFixture<StockStableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockStableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockStableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
