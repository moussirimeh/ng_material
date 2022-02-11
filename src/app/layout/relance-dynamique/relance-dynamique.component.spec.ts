import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelanceDynamiqueComponent } from './relance-dynamique.component';

describe('RelanceDynamiqueComponent', () => {
  let component: RelanceDynamiqueComponent;
  let fixture: ComponentFixture<RelanceDynamiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelanceDynamiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelanceDynamiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
