import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowTournamentPage } from './show-tournament.page';

describe('ShowTournamentPage', () => {
  let component: ShowTournamentPage;
  let fixture: ComponentFixture<ShowTournamentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
