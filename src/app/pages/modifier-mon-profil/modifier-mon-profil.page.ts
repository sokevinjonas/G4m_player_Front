import { Component, OnInit } from '@angular/core';
import { AFRICAN_COUNTRIES } from 'src/app/core/mocks/mock-african-countries';

@Component({
  selector: 'app-modifier-mon-profil',
  templateUrl: './modifier-mon-profil.page.html',
  styleUrls: ['./modifier-mon-profil.page.scss'],
  standalone: false,
})
export class ModifierMonProfilPage implements OnInit {
  user: any = {}; // Initialize user object
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: Blob | null = null;
  countryList = AFRICAN_COUNTRIES;

  constructor() {}

  ionViewWillEnter() {
    // This method can be used to refresh data when the view is about to enter
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }

  onFileSelected(): void {}

  saveProfile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);
      formData.append('name', this.user.name);
      formData.append('email', this.user.email);
      formData.append('country', this.user.country);
      formData.append('bio', this.user.bio);

      // Envoyer à l'API
      console.log('FormData:', formData);
      // Ajouter la logique pour envoyer formData à l'API
    }
  }
}
