import { TestBed } from '@angular/core/testing';

import { GameshelfService } from './gameshelf.service';

describe('GameshelfService', () => {
  let service: GameshelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameshelfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
