import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReeditionRapportAchatComponent } from './reedition-rapport-achat.component';

describe('ReeditionRapportAchatComponent', () => {
  let component: ReeditionRapportAchatComponent;
  let fixture: ComponentFixture<ReeditionRapportAchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReeditionRapportAchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReeditionRapportAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
