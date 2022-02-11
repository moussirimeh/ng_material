import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetClientsNoyeauComponent } from './det-clients-noyeau.component';

describe('DetClientsNoyeauComponent', () => {
  let component: DetClientsNoyeauComponent;
  let fixture: ComponentFixture<DetClientsNoyeauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetClientsNoyeauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetClientsNoyeauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
