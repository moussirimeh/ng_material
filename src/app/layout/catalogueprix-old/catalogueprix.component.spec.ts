import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueprixComponent } from './catalogueprix.component';

describe('CatalogueprixComponent', () => {
  let component: CatalogueprixComponent;
  let fixture: ComponentFixture<CatalogueprixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueprixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueprixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
