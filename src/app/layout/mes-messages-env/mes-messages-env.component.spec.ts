import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesMessagesEnvComponent } from './mes-messages-env.component';

describe('MesMessagesEnvComponent', () => {
  let component: MesMessagesEnvComponent;
  let fixture: ComponentFixture<MesMessagesEnvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesMessagesEnvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesMessagesEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
