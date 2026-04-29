import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LeaderService } from './leader.service';

describe('LeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: LeaderService = TestBed.get(LeaderService);
    expect(service).toBeTruthy();
  });
});
