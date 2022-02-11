import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatStockMortComponent } from './etat-stock-mort.component';

describe('EtatStockMortComponent', () => {
  let component: EtatStockMortComponent;
  let fixture: ComponentFixture<EtatStockMortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatStockMortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatStockMortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
