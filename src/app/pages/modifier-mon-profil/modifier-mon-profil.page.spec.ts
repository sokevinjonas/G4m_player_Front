import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifierMonProfilPage } from './modifier-mon-profil.page';

describe('ModifierMonProfilPage', () => {
  let component: ModifierMonProfilPage;
  let fixture: ComponentFixture<ModifierMonProfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierMonProfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
