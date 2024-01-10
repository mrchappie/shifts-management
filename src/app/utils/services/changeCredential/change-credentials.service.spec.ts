import { TestBed } from '@angular/core/testing';

import { ChangeCredentialsService } from './change-credentials.service';

describe('ChangeCredentialsService', () => {
  let service: ChangeCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeCredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
