import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeblocagecltsComponent } from './deblocageclts.component';

describe('DeblocagecltsComponent', () => {
  let component: DeblocagecltsComponent;
  let fixture: ComponentFixture<DeblocagecltsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeblocagecltsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeblocagecltsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
