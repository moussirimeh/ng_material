import { TestBed, inject } from '@angular/core/testing';
import { BrouService } from '../services/brou.service';



describe('BrouService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule({
      providers: [BrouService]
  });
});

  it('should be created', inject([BrouService], (service: BrouService) => {

    expect(service).toBeTruthy();
  }));
});
