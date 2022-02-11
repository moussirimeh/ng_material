import { TestBed } from '@angular/core/testing';

import { MouveinventService } from './mouveinvent.service';

describe('MouveinventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MouveinventService = TestBed.get(MouveinventService);
    expect(service).toBeTruthy();
  });
});
