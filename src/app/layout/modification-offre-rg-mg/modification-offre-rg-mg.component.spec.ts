import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationOffreRgMgComponent } from './modification-offre-rg-mg.component';

describe('ModificationOffreRgMgComponent', () => {
  let component: ModificationOffreRgMgComponent;
  let fixture: ComponentFixture<ModificationOffreRgMgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationOffreRgMgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationOffreRgMgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
