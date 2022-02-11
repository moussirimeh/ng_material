import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionreferenceComponent } from './fusionreference.component';

describe('FusionreferenceComponent', () => {
  let component: FusionreferenceComponent;
  let fixture: ComponentFixture<FusionreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
