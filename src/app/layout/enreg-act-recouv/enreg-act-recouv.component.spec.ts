import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregActRecouvComponent } from './enreg-act-recouv.component';

describe('EnregActRecouvComponent', () => {
  let component: EnregActRecouvComponent;
  let fixture: ComponentFixture<EnregActRecouvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnregActRecouvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnregActRecouvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
