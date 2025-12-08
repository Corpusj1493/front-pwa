import { TestBed } from '@angular/core/testing';

import { PlaceServices } from './place.services';

describe('PlaceServices', () => {
  let service: PlaceServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
