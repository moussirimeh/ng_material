import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifsFrsCmdsComponent } from './objectifs-frs-cmds.component';

describe('ObjectifsFrsCmdsComponent', () => {
  let component: ObjectifsFrsCmdsComponent;
  let fixture: ComponentFixture<ObjectifsFrsCmdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectifsFrsCmdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectifsFrsCmdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
