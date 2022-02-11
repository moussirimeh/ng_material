import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvoirSurAchatComponent } from './avoir-sur-achat.component';

describe('AvoirSurAchatComponent', () => {
  let component: AvoirSurAchatComponent;
  let fixture: ComponentFixture<AvoirSurAchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvoirSurAchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvoirSurAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
