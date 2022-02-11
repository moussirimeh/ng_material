import { TestBed } from '@angular/core/testing';

import { DcomService } from './dcom.service';

describe('DcomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DcomService = TestBed.get(DcomService);
    expect(service).toBeTruthy();
  });
});
