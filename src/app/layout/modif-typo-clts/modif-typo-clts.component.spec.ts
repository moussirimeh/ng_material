import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifTypoCltsComponent } from './modif-typo-clts.component';

describe('ModifTypoCltsComponent', () => {
  let component: ModifTypoCltsComponent;
  let fixture: ComponentFixture<ModifTypoCltsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifTypoCltsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifTypoCltsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
