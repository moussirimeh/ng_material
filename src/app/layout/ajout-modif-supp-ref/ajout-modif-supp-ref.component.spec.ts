import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutModifSuppRefComponent } from './ajout-modif-supp-ref.component';

describe('AjoutModifSuppRefComponent', () => {
  let component: AjoutModifSuppRefComponent;
  let fixture: ComponentFixture<AjoutModifSuppRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjoutModifSuppRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutModifSuppRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
