import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationMarqueComponent } from './affectation-marque.component';

describe('AffectationMarqueComponent', () => {
  let component: AffectationMarqueComponent;
  let fixture: ComponentFixture<AffectationMarqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectationMarqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationMarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
