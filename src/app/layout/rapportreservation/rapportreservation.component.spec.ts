import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportreservationComponent } from './rapportreservation.component';

describe('RapportreservationComponent', () => {
  let component: RapportreservationComponent;
  let fixture: ComponentFixture<RapportreservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportreservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
