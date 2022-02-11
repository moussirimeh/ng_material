import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDesAchatsComponent } from './rapport-des-achats.component';

describe('RapportDesAchatsComponent', () => {
  let component: RapportDesAchatsComponent;
  let fixture: ComponentFixture<RapportDesAchatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportDesAchatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportDesAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
