import { TestBed } from '@angular/core/testing';

import { TableVisiteService } from './table-visite.service';

describe('TableVisiteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableVisiteService = TestBed.get(TableVisiteService);
    expect(service).toBeTruthy();
  });
});
