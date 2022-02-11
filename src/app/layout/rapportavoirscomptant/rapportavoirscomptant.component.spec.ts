import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportavoirscomptantComponent } from './rapportavoirscomptant.component';

describe('RapportavoirscomptantComponent', () => {
  let component: RapportavoirscomptantComponent;
  let fixture: ComponentFixture<RapportavoirscomptantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportavoirscomptantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportavoirscomptantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
