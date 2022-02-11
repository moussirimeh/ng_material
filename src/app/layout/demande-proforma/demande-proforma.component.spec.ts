import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeProformaComponent } from './demande-proforma.component';

describe('DemandeProformaComponent', () => {
  let component: DemandeProformaComponent;
  let fixture: ComponentFixture<DemandeProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
