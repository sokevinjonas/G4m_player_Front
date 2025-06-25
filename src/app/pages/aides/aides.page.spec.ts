import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AidesPage } from './aides.page';

describe('AidesPage', () => {
  let component: AidesPage;
  let fixture: ComponentFixture<AidesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
