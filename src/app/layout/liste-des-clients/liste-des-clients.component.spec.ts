import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesClientsComponent } from './liste-des-clients.component';

describe('ListeDesClientsComponent', () => {
  let component: ListeDesClientsComponent;
  let fixture: ComponentFixture<ListeDesClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeDesClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeDesClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
