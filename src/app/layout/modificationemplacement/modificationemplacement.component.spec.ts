import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationemplacementComponent } from './modificationemplacement.component';

describe('ModificationemplacementComponent', () => {
  let component: ModificationemplacementComponent;
  let fixture: ComponentFixture<ModificationemplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationemplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationemplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
