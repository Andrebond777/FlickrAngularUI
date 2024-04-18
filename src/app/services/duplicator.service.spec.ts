import { TestBed } from '@angular/core/testing';

import { DuplicatorService } from './duplicator.service';

describe('DuplicatorService', () => {
  let service: DuplicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
