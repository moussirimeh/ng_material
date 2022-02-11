import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionRegltFournisseurComponent } from './reception-reglt-fournisseur.component';

describe('ReceptionRegltFournisseurComponent', () => {
  let component: ReceptionRegltFournisseurComponent;
  let fixture: ComponentFixture<ReceptionRegltFournisseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionRegltFournisseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionRegltFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
