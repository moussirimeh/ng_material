import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptabiliteEtatEngagementFourComponent } from './comptabilite-etat-engagement-four.component';

describe('ComptabiliteEtatEngagementFourComponent', () => {
  let component: ComptabiliteEtatEngagementFourComponent;
  let fixture: ComponentFixture<ComptabiliteEtatEngagementFourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComptabiliteEtatEngagementFourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptabiliteEtatEngagementFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
