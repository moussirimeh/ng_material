import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorisationOffreComponent } from './autorisation-offre.component';

describe('AutorisationOffreComponent', () => {
  let component: AutorisationOffreComponent;
  let fixture: ComponentFixture<AutorisationOffreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorisationOffreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorisationOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
