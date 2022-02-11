import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementClientContComponent } from './reglement-client-cont.component';

describe('ReglementClientContComponent', () => {
  let component: ReglementClientContComponent;
  let fixture: ComponentFixture<ReglementClientContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglementClientContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementClientContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
