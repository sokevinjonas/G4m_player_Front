import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AFRICAN_COUNTRIES } from 'src/app/core/mocks/mock-african-countries';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
  selector: 'app-modifier-mon-profil',
  templateUrl: './modifier-mon-profil.page.html',
  styleUrls: ['./modifier-mon-profil.page.scss'],
  standalone: false,
})
export class ModifierMonProfilPage implements OnInit {
  user: any = {};
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: Blob | null = null;
  countryList = AFRICAN_COUNTRIES;

  constructor(private apiService: ApiService) {}

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  async takePicture() {
    try {
      // Vérifie si on est sur un device natif
      if (Capacitor.getPlatform() !== 'web') {
        const permission = await Camera.requestPermissions({
          permissions: ['camera', 'photos'],
        });

        if (
          permission.camera !== 'granted' &&
          permission.photos !== 'granted'
        ) {
          console.warn('Permission caméra ou galerie refusée');
          return;
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // ← permet de choisir entre appareil photo ou galerie
        promptLabelHeader: 'Changer la Photo de Profil',
        promptLabelPhoto: 'Choisir dans la Galerie',
        promptLabelPicture: 'Prendre une Photo',
      });

      if (image.webPath) {
        this.user.avatar = image.webPath;
        this.previewImage = image.webPath;

        const response = await fetch(image.webPath);
        const blob = await response.blob();
        this.selectedFile = blob;
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l’image', error);
    }
  }

  saveProfile(): void {
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile, 'avatar.jpg');
    }

    formData.append('name', this.user.name || '');
    formData.append('email', this.user.email || '');
    formData.append('country', this.user.country || '');
    formData.append('bio', this.user.bio || '');
    // Affiche dans la console pour test (remplace ça par ton appel API réel)
    console.log('FormData ready to send:', formData);

    this.apiService.updateUserProfile(formData).subscribe({
      next: (res) => {
        console.log('Profil mis à jour avec succès', res);
        // Optionnel : mettre à jour localStorage si nécessaire
        localStorage.setItem('user', JSON.stringify(res.user));
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      },
    });
  }
}
