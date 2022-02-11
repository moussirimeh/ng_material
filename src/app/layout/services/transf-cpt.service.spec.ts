import { TestBed } from '@angular/core/testing';

import { TransfCptService } from './transf-cpt.service';

describe('TransfCptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransfCptService = TestBed.get(TransfCptService);
    expect(service).toBeTruthy();
  });
});
