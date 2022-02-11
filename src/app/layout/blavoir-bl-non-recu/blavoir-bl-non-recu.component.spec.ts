import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlavoirBlNonRecuComponent } from './blavoir-bl-non-recu.component';

describe('BlavoirBlNonRecuComponent', () => {
  let component: BlavoirBlNonRecuComponent;
  let fixture: ComponentFixture<BlavoirBlNonRecuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlavoirBlNonRecuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlavoirBlNonRecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
