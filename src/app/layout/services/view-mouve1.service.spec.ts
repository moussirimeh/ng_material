import { TestBed } from '@angular/core/testing';

import { ViewMouve1Service } from './view-mouve1.service';

describe('ViewMouve1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewMouve1Service = TestBed.get(ViewMouve1Service);
    expect(service).toBeTruthy();
  });
});
