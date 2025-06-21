import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowGamesPage } from './show-games.page';

describe('ShowGamesPage', () => {
  let component: ShowGamesPage;
  let fixture: ComponentFixture<ShowGamesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
