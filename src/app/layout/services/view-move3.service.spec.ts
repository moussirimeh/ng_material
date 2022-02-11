import { TestBed } from '@angular/core/testing';

import { ViewMove3Service } from './view-move3.service';

describe('ViewMove3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewMove3Service = TestBed.get(ViewMove3Service);
    expect(service).toBeTruthy();
  });
});
