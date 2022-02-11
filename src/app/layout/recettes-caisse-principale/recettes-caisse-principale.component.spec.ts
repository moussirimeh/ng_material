import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecettesCaissePrincipaleComponent } from './recettes-caisse-principale.component';

describe('RecettesCaissePrincipaleComponent', () => {
  let component: RecettesCaissePrincipaleComponent;
  let fixture: ComponentFixture<RecettesCaissePrincipaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecettesCaissePrincipaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecettesCaissePrincipaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
