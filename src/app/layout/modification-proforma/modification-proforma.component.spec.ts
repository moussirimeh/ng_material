import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationProformaComponent } from './modification-proforma.component';

describe('ModificationProformaComponent', () => {
  let component: ModificationProformaComponent;
  let fixture: ComponentFixture<ModificationProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
