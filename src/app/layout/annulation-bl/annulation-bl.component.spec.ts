import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationBLComponent } from './annulation-bl.component';

describe('AnnulationBLComponent', () => {
  let component: AnnulationBLComponent;
  let fixture: ComponentFixture<AnnulationBLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnulationBLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnulationBLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
