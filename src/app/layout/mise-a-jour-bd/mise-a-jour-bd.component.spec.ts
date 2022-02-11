import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseAJourBdComponent } from './mise-a-jour-bd.component';

describe('MiseAJourBdComponent', () => {
  let component: MiseAJourBdComponent;
  let fixture: ComponentFixture<MiseAJourBdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiseAJourBdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiseAJourBdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
