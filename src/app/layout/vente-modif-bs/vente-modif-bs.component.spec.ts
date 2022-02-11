import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteModifBSComponent } from './vente-modif-bs.component';

describe('VenteModifBSComponent', () => {
  let component: VenteModifBSComponent;
  let fixture: ComponentFixture<VenteModifBSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenteModifBSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenteModifBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
