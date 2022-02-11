import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreClientAnComponent } from './offre-client-an.component';

describe('OffreClientAnComponent', () => {
  let component: OffreClientAnComponent;
  let fixture: ComponentFixture<OffreClientAnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffreClientAnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreClientAnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
