import { TestBed } from '@angular/core/testing';

import { SatisfactionService } from './satisfaction.service';

describe('SatisfactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SatisfactionService = TestBed.get(SatisfactionService);
    expect(service).toBeTruthy();
  });
});
