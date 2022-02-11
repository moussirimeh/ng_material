import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportAjustementComponent } from './rapport-ajustement.component';

describe('RapportAjustementComponent', () => {
  let component: RapportAjustementComponent;
  let fixture: ComponentFixture<RapportAjustementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportAjustementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportAjustementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
