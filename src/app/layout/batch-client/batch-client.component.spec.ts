import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchClientComponent } from './batch-client.component';

describe('BatchClientComponent', () => {
  let component: BatchClientComponent;
  let fixture: ComponentFixture<BatchClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
