import { TestBed } from '@angular/core/testing';

import { MultiMediaService } from './multi-media.service';

describe('MultiMediaService', () => {
  let service: MultiMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
