import { TestBed } from '@angular/core/testing';

import { CustomFnService } from './custom-fn.service';

describe('CustomFnService', () => {
  let service: CustomFnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
