import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopieOffreComponent } from './copie-offre.component';

describe('CopieOffreComponent', () => {
  let component: CopieOffreComponent;
  let fixture: ComponentFixture<CopieOffreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopieOffreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopieOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
