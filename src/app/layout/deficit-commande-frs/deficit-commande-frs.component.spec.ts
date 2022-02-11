import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeficitCommandeFrsComponent } from './deficit-commande-frs.component';

describe('DeficitCommandeFrsComponent', () => {
  let component: DeficitCommandeFrsComponent;
  let fixture: ComponentFixture<DeficitCommandeFrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeficitCommandeFrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeficitCommandeFrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
