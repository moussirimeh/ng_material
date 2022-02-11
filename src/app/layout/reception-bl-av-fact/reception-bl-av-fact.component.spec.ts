import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionBlAvFactComponent } from './reception-bl-av-fact.component';

describe('ReceptionBlAvFactComponent', () => {
  let component: ReceptionBlAvFactComponent;
  let fixture: ComponentFixture<ReceptionBlAvFactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionBlAvFactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionBlAvFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
