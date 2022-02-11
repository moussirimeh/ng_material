import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseChiffAffComponent } from './analyse-chiff-aff.component';

describe('AnalyseChiffAffComponent', () => {
  let component: AnalyseChiffAffComponent;
  let fixture: ComponentFixture<AnalyseChiffAffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyseChiffAffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseChiffAffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
