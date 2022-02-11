import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatVisiteClientComponent } from './etat-visite-client.component';

describe('EtatVisiteClientComponent', () => {
  let component: EtatVisiteClientComponent;
  let fixture: ComponentFixture<EtatVisiteClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatVisiteClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatVisiteClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
