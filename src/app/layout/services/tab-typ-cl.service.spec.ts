import { TestBed } from '@angular/core/testing';

import { TabTypClService } from './tab-typ-cl.service';

describe('TabTypClService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabTypClService = TestBed.get(TabTypClService);
    expect(service).toBeTruthy();
  });
});
