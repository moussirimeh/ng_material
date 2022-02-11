import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreClientComponent } from './offre-client.component';

describe('OffreClientComponent', () => {
  let component: OffreClientComponent;
  let fixture: ComponentFixture<OffreClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffreClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
