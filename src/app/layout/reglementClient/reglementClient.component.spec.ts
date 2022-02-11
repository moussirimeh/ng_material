import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReglementClientComponent } from './reglementClient.component';



describe('AppurementReglementComponent', () => {
  let component: ReglementClientComponent;
  let fixture: ComponentFixture<ReglementClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglementClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
