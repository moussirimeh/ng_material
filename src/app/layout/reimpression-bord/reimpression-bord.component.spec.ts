import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimpressionBordComponent } from './reimpression-bord.component';

describe('ReimpressionBordComponent', () => {
  let component: ReimpressionBordComponent;
  let fixture: ComponentFixture<ReimpressionBordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimpressionBordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimpressionBordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
