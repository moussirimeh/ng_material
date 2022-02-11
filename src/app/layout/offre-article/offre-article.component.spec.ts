import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffreArticleComponent } from './offre-article.component';

describe('OffreArticleComponent', () => {
  let component: OffreArticleComponent;
  let fixture: ComponentFixture<OffreArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffreArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
