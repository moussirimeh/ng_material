import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquecreanceszoneComponent } from './historiquecreanceszone.component';

describe('HistoriquecreanceszoneComponent', () => {
  let component: HistoriquecreanceszoneComponent;
  let fixture: ComponentFixture<HistoriquecreanceszoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriquecreanceszoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriquecreanceszoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
