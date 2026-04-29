import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PromotionService } from './promotion.service';

describe('PromotionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: PromotionService = TestBed.get(PromotionService);
    expect(service).toBeTruthy();
  });
});
