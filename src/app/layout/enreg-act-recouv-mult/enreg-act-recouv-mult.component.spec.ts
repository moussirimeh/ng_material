import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregActRecouvMultComponent } from './enreg-act-recouv-mult.component';

describe('EnregActRecouvMultComponent', () => {
  let component: EnregActRecouvMultComponent;
  let fixture: ComponentFixture<EnregActRecouvMultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnregActRecouvMultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnregActRecouvMultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
