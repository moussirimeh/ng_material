import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiseajourinventaireComponent } from './miseajourinventaire.component';

describe('MiseajourinventaireComponent', () => {
  let component: MiseajourinventaireComponent;
  let fixture: ComponentFixture<MiseajourinventaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiseajourinventaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiseajourinventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
