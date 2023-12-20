import { TestBed } from '@angular/core/testing';

import { HandleDBService } from './handle-db.service';

describe('HandleDBService', () => {
  let service: HandleDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
