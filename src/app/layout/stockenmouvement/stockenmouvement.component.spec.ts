import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockenmouvementComponent } from './stockenmouvement.component';

describe('StockenmouvementComponent', () => {
  let component: StockenmouvementComponent;
  let fixture: ComponentFixture<StockenmouvementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockenmouvementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockenmouvementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
