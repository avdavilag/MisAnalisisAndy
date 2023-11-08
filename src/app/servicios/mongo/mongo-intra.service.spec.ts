import { TestBed } from '@angular/core/testing';

import { MongoIntraService } from './mongo-intra.service';

describe('MongoIntraService', () => {
  let service: MongoIntraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongoIntraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
