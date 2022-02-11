import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifCmdClientComponent } from './modif-cmd-client.component';

describe('ModifCmdClientComponent', () => {
  let component: ModifCmdClientComponent;
  let fixture: ComponentFixture<ModifCmdClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifCmdClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifCmdClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
