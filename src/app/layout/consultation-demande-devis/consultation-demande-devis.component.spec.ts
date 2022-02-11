import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDemandeDevisComponent } from './consultation-demande-devis.component';

describe('ConsultationDemandeDevisComponent', () => {
  let component: ConsultationDemandeDevisComponent;
  let fixture: ComponentFixture<ConsultationDemandeDevisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationDemandeDevisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationDemandeDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
