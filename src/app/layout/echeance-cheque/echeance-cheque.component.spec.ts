import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcheanceChequeComponent } from './echeance-cheque.component';

describe('EcheanceChequeComponent', () => {
  let component: EcheanceChequeComponent;
  let fixture: ComponentFixture<EcheanceChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcheanceChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcheanceChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
