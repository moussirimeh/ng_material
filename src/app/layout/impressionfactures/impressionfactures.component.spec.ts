import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpressionFacturesComponent } from './impressionfactures.component';

describe('ImpressionFacturesComponent', () => {
  let component: ImpressionFacturesComponent;
  let fixture: ComponentFixture<ImpressionFacturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpressionFacturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressionFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
