import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlEnCoursComponent } from './bl-en-cours.component';

describe('BlEnCoursComponent', () => {
  let component: BlEnCoursComponent;
  let fixture: ComponentFixture<BlEnCoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlEnCoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
