import { TestBed } from '@angular/core/testing';

import { ViewMouve2Service } from './view-mouve2.service';

describe('ViewMouve2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewMouve2Service = TestBed.get(ViewMouve2Service);
    expect(service).toBeTruthy();
  });
});
