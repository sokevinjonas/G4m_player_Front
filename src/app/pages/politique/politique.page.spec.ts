import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolitiquePage } from './politique.page';

describe('PolitiquePage', () => {
  let component: PolitiquePage;
  let fixture: ComponentFixture<PolitiquePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PolitiquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
