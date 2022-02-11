import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepensesCaisseSecondaireComponent } from './depenses-caisse-secondaire.component';

describe('DepensesCaisseSecondaireComponent', () => {
  let component: DepensesCaisseSecondaireComponent;
  let fixture: ComponentFixture<DepensesCaisseSecondaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepensesCaisseSecondaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepensesCaisseSecondaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
