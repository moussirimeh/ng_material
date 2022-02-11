import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatAvoirsTermeComponent } from './etat-avoirs-terme.component';

describe('EtatAvoirsTermeComponent', () => {
  let component: EtatAvoirsTermeComponent;
  let fixture: ComponentFixture<EtatAvoirsTermeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatAvoirsTermeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatAvoirsTermeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
