import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepensesCaissePrincipaleComponent } from './depenses-caisse-principale.component';

describe('DepensesCaissePrincipaleComponent', () => {
  let component: DepensesCaissePrincipaleComponent;
  let fixture: ComponentFixture<DepensesCaissePrincipaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepensesCaissePrincipaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepensesCaissePrincipaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
