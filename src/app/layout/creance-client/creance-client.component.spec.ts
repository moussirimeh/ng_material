import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreanceClientComponent } from './creance-client.component';

describe('CreanceClientComponent', () => {
  let component: CreanceClientComponent;
  let fixture: ComponentFixture<CreanceClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreanceClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreanceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
