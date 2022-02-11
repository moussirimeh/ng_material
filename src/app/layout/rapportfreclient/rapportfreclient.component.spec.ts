import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportfreclientComponent } from './rapportfreclient.component';

describe('RapportfreclientComponent', () => {
  let component: RapportfreclientComponent;
  let fixture: ComponentFixture<RapportfreclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportfreclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportfreclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
