import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecettesCaisseSecondaireComponent } from './recettes-caisse-secondaire.component';

describe('RecettesCaisseSecondaireComponent', () => {
  let component: RecettesCaisseSecondaireComponent;
  let fixture: ComponentFixture<RecettesCaisseSecondaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecettesCaisseSecondaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecettesCaisseSecondaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
