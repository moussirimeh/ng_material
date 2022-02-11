import { TestBed } from '@angular/core/testing';

import { DLivraisonService } from './dlivraison.service';

describe('DLivraisonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DLivraisonService = TestBed.get(DLivraisonService);
    expect(service).toBeTruthy();
  });
});
