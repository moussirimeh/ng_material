import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationProformaComponent } from './annulation-proforma.component';

describe('AnnulationProformaComponent', () => {
  let component: AnnulationProformaComponent;
  let fixture: ComponentFixture<AnnulationProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnulationProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulationProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
