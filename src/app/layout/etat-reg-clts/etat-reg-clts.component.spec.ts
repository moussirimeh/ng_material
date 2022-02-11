import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatRegCltsComponent } from './etat-reg-clts.component';

describe('EtatRegCltsComponent', () => {
  let component: EtatRegCltsComponent;
  let fixture: ComponentFixture<EtatRegCltsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatRegCltsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatRegCltsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
