import { TestBed } from '@angular/core/testing';

import { GamelogService } from './gamelog.service';

describe('GamelogService', () => {
  let service: GamelogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamelogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
