import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationTresorerieComponent } from './consultation-tresorerie.component';

describe('ConsultationTresorerieComponent', () => {
  let component: ConsultationTresorerieComponent;
  let fixture: ComponentFixture<ConsultationTresorerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationTresorerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationTresorerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
