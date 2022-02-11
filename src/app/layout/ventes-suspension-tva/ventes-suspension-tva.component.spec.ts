import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentesSuspensionTvaComponent } from './ventes-suspension-tva.component';

describe('VentesSuspensionTvaComponent', () => {
  let component: VentesSuspensionTvaComponent;
  let fixture: ComponentFixture<VentesSuspensionTvaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentesSuspensionTvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentesSuspensionTvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
