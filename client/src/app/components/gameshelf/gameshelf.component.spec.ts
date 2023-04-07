import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameShelfComponent } from './gameshelf.component';

describe('GameshelfComponent', () => {
  let component: GameShelfComponent;
  let fixture: ComponentFixture<GameShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameShelfComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
