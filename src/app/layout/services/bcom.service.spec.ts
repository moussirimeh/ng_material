import { TestBed } from '@angular/core/testing';

import { BcomService } from './bcom.service';

describe('BcomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BcomService = TestBed.get(BcomService);
    expect(service).toBeTruthy();
  });
});
