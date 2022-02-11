import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfCptComponent } from './transf-cpt.component';

describe('TransfCptComponent', () => {
  let component: TransfCptComponent;
  let fixture: ComponentFixture<TransfCptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfCptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
