import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AFRICAN_COUNTRIES } from 'src/app/core/mocks/mock-african-countries';

@Component({
  selector: 'app-modifier-mon-profil',
  templateUrl: './modifier-mon-profil.page.html',
  styleUrls: ['./modifier-mon-profil.page.scss'],
  standalone: false,
})
export class ModifierMonProfilPage implements OnInit {
  form!: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  countryList = AFRICAN_COUNTRIES;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.form = this.fb.group({
      name: [user.name || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      country: [user.country || '', Validators.required],
      description: [user.description || ''], // Utiliser description du backend
    });

    if (user.avatar) {
      this.previewImage = user.avatar;
    }
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // Utiliser Uri au lieu de DataUrl
        source: CameraSource.Prompt,
        promptLabelHeader: 'Changer la Photo de Profil',
        promptLabelPhoto: 'Choisir dans la Galerie',
        promptLabelPicture: 'Prendre une Photo',
      });

      if (image.webPath) {
        this.previewImage = image.webPath;

        // Récupérer le fichier depuis l'URI
        const response = await fetch(image.webPath);
        const blob = await response.blob();

        // Créer un File avec le bon type MIME détecté
        const fileType = blob.type || 'image/jpeg';
        const fileName = `avatar.${fileType.split('/')[1] || 'jpg'}`;

        this.selectedFile = new File([blob], fileName, {
          type: fileType,
        });

        console.log('Image sélectionnée:', {
          name: this.selectedFile.name,
          size: this.selectedFile.size,
          type: this.selectedFile.type,
          isFile: this.selectedFile instanceof File,
        });
      }
    } catch (error) {
      console.error('Erreur image:', error);
      this.showToast("Erreur lors de la sélection de l'image");
    }
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.showToast('Veuillez remplir tous les champs requis');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mise à jour...',
      spinner: 'crescent',
    });
    await loading.present();

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('country', this.form.get('country')?.value);
    formData.append('description', this.form.get('description')?.value);

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
      console.log('Fichier avatar ajouté:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
      });
    } else {
      console.log('Aucun fichier sélectionné');
    }

    console.log('FormData créé avec avatar:', !!this.selectedFile);

    // Debug : vérifier si le fichier est bien dans le FormData
    const avatarFromFormData = formData.get('avatar');
    console.log('Avatar dans FormData:', avatarFromFormData);
    if (avatarFromFormData instanceof File) {
      console.log('Avatar est bien un File:', {
        name: avatarFromFormData.name,
        size: avatarFromFormData.size,
        type: avatarFromFormData.type,
      });
    }

    this.apiService.updateUserProfile(formData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        console.log('Réponse backend:', res);
        this.showToast(res.message || 'Profil mis à jour');

        localStorage.setItem('user', JSON.stringify(res.user));
        this.previewImage = res.user.avatar; // URL complète retournée par Laravel
        this.selectedFile = null; // Reset du fichier sélectionné
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Erreur MAJ:', err);
        console.error('Détails erreur:', err.error);
        this.showToast('Erreur lors de la mise à jour');
      },
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}
