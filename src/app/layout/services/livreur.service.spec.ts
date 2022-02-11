import { TestBed } from '@angular/core/testing';

import { LivreurService } from './livreur.service';

describe('LivreurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LivreurService = TestBed.get(LivreurService);
    expect(service).toBeTruthy();
  });
});
