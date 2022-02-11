import { TestBed, inject } from '@angular/core/testing';

import { EquivalenceService } from '../services/equivalence.service';

describe('EquivalenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquivalenceService]
    });
  });

  it('should be created', inject([EquivalenceService], (service: EquivalenceService) => {
    expect(service).toBeTruthy();
  }));
});
