import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationCmdCltComponent } from './annulation-cmd-clt.component';

describe('AnnulationCmdCltComponent', () => {
  let component: AnnulationCmdCltComponent;
  let fixture: ComponentFixture<AnnulationCmdCltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnulationCmdCltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulationCmdCltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
