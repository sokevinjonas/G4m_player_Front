import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParrainagePage } from './parrainage.page';

describe('ParrainagePage', () => {
  let component: ParrainagePage;
  let fixture: ComponentFixture<ParrainagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ParrainagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
