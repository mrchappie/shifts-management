import { TestBed } from '@angular/core/testing';

import { AggQueriesService } from './agg-queries.service';

describe('AggQueriesService', () => {
  let service: AggQueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AggQueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
