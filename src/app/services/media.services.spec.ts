import { TestBed } from '@angular/core/testing';

import { MediaServices } from './media.services';

describe('MediaServices', () => {
  let service: MediaServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
