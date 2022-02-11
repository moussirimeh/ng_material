import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatAppurRegCltsComponent } from './etat-appur-reg-clts.component';

describe('EtatAppurRegCltsComponent', () => {
  let component: EtatAppurRegCltsComponent;
  let fixture: ComponentFixture<EtatAppurRegCltsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatAppurRegCltsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatAppurRegCltsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
