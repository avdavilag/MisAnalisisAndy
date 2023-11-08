import { TestBed } from '@angular/core/testing';

import { WebRestService } from './web-rest.service';

describe('WebRestService', () => {
  let service: WebRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
