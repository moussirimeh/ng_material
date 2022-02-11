import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdsFrsNonSoldeesComponent } from './cmds-frs-non-soldees.component';

describe('CmdsFrsNonSoldeesComponent', () => {
  let component: CmdsFrsNonSoldeesComponent;
  let fixture: ComponentFixture<CmdsFrsNonSoldeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdsFrsNonSoldeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdsFrsNonSoldeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
