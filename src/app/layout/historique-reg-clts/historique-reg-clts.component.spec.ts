import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueRegCltsComponent } from './historique-reg-clts.component';

describe('HistoriqueRegCltsComponent', () => {
  let component: HistoriqueRegCltsComponent;
  let fixture: ComponentFixture<HistoriqueRegCltsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueRegCltsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueRegCltsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
