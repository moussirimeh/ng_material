import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheStockDetailComponent } from './fiche-stock-detail.component';

describe('FicheStockDetailComponent', () => {
  let component: FicheStockDetailComponent;
  let fixture: ComponentFixture<FicheStockDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheStockDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheStockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
