import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationReglementClientComponent } from './consultation-reglement-client.component';


describe('AppurementReglementComponent', () => {
  let component: ConsultationReglementClientComponent;
  let fixture: ComponentFixture<ConsultationReglementClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationReglementClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationReglementClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
