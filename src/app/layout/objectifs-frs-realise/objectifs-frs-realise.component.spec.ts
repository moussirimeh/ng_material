import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifsFrsRealiseComponent } from './objectifs-frs-realise.component';

describe('ObjectifsFrsRealiseComponent', () => {
  let component: ObjectifsFrsRealiseComponent;
  let fixture: ComponentFixture<ObjectifsFrsRealiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectifsFrsRealiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectifsFrsRealiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
