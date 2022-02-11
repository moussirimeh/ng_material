import { TestBed } from '@angular/core/testing';

import { ViewMouveService } from './view-mouve.service';

describe('ViewMouveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewMouveService = TestBed.get(ViewMouveService);
    expect(service).toBeTruthy();
  });
});
