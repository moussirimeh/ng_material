import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesProformatsComponent } from './liste-des-proformats.component';

describe('ListeDesProformatsComponent', () => {
  let component: ListeDesProformatsComponent;
  let fixture: ComponentFixture<ListeDesProformatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeDesProformatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDesProformatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
