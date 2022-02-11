import { TestBed } from '@angular/core/testing';

import { ElivraisonService } from './elivraison.service';

describe('ElivraisonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElivraisonService = TestBed.get(ElivraisonService);
    expect(service).toBeTruthy();
  });
});
