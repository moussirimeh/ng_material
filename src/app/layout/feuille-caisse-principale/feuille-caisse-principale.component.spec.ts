import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleCaissePrincipaleComponent } from './feuille-caisse-principale.component';

describe('FeuilleCaissePrincipaleComponent', () => {
  let component: FeuilleCaissePrincipaleComponent;
  let fixture: ComponentFixture<FeuilleCaissePrincipaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeuilleCaissePrincipaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeuilleCaissePrincipaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
