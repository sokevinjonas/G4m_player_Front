import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ToastController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { FileSaveOrPreviewService } from 'src/app/core/services/fileSaveOrPreview/file-save-or-preview.service';
import { AFRICAN_COUNTRIES } from 'src/app/core/mocks/mock-african-countries';
import { AvatarSelectionModalComponent } from 'src/app/components/avatar-selection-modal/avatar-selection-modal.component';

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

  // Liste d'avatars prédéfinis
  predefinedAvatars = [
    'assets/avatars/avatar1.jpg',
    'assets/avatars/avatar2.jpg',
    'assets/avatars/avatar3.jpg',
    'assets/avatars/avatar4.jpg',
    'assets/avatars/avatar5.jpg',
    'assets/avatars/avatar6.jpg',
    'assets/avatars/avatar7.jpg',
    'assets/avatars/avatar8.jpg',
    'assets/avatars/avatar9.jpg',
    'assets/avatars/avatar10.jpg',
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private fileSaveOrPreviewService: FileSaveOrPreviewService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.form = this.fb.group({
      name: [user.name || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      country: [user.country || '', Validators.required],
      description: [user.description || ''], // Utiliser description du backend
      predefined_avatar: [''], // Nouveau champ pour les avatars prédéfinis
    });

    if (user.avatar) {
      this.previewImage = this.fileSaveOrPreviewService.getAvatarDisplayUrl(
        user.avatar
      );
    }
  }

  async selectImage() {
    try {
      // Vérifier la plateforme
      if (
        this.platform.is('ios') ||
        this.platform.is('mobileweb') ||
        this.platform.is('desktop')
      ) {
        // Proposer les avatars prédéfinis pour web et iOS
        await this.showAvatarSelectionModal();
      } else {
        // Utiliser la caméra pour Android
        const result = await this.fileSaveOrPreviewService.selectImage();

        if (result) {
          this.selectedFile = result.file;
          this.previewImage = result.previewUrl;

          console.log('Image sélectionnée via service:', {
            name: result.file.name,
            size: result.file.size,
            type: result.file.type,
          });
        }
      }
    } catch (error) {
      console.error('Erreur image:', error);
      this.showToast("Erreur lors de la sélection de l'image", 'warning');
    }
  }

  async showAvatarSelectionModal() {
    const modal = await this.modalController.create({
      component: AvatarSelectionModalComponent,
      componentProps: {
        avatars: this.predefinedAvatars,
      },
      cssClass: 'avatar-selection-modal',
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (result.data.type === 'predefined') {
          this.selectPredefinedAvatar(result.data.avatar);
        } else if (result.data.type === 'camera') {
          this.selectImageFromCamera();
        }
      }
    });

    return await modal.present();
  }

  async selectImageFromCamera() {
    try {
      const result = await this.fileSaveOrPreviewService.selectImage();
      if (result) {
        this.selectedFile = result.file;
        this.previewImage = result.previewUrl;
        // Reset avatar prédéfini
        this.form.patchValue({ predefined_avatar: '' });
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      this.showToast('Erreur lors de la prise de photo', 'warning');
    }
  }

  selectPredefinedAvatar(avatarPath: string) {
    this.previewImage = avatarPath;
    this.selectedFile = null; // Pas de fichier car c'est un avatar prédéfini

    // Marquer que c'est un avatar prédéfini pour l'envoi au serveur
    this.form.patchValue({
      predefined_avatar: avatarPath,
    });

    console.log('Avatar prédéfini sélectionné:', avatarPath);
    this.showToast('Avatar sélectionné !', 'success');
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.showToast('Veuillez remplir tous les champs requis', 'warning');
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

    // Gérer l'avatar (fichier ou prédéfini)
    const predefinedAvatar = this.form.get('predefined_avatar')?.value;

    if (this.selectedFile) {
      // Avatar personnalisé uploadé
      formData.append('avatar', this.selectedFile);
      console.log('Fichier avatar ajouté:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
      });
    } else if (predefinedAvatar) {
      // Avatar prédéfini sélectionné
      formData.append('predefined_avatar', predefinedAvatar);
      console.log('Avatar prédéfini sélectionné:', predefinedAvatar);
    } else {
      console.log('Aucun avatar sélectionné');
    }

    console.log(
      'FormData créé avec avatar:',
      !!this.selectedFile || !!predefinedAvatar
    );

    this.apiService.updateUserProfile(formData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        console.log('Réponse backend:', res);
        this.showToast(res.message, 'success');

        localStorage.setItem('user', JSON.stringify(res.user));

        // Utiliser le service pour obtenir l'URL d'affichage correcte
        this.previewImage = this.fileSaveOrPreviewService.getAvatarDisplayUrl(
          res.user.avatar
        );
        this.selectedFile = null; // Reset du fichier sélectionné
        this.form.patchValue({ predefined_avatar: '' }); // Reset avatar prédéfini
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Erreur MAJ:', err);
        console.error('Détails erreur:', err.error);
        this.showToast(
          'Erreur lors de la mise à jour, vérifier votre connexion internet',
          'warning'
        );
      },
    });
  }

  getDefaultAvatarUrl(): string {
    return this.fileSaveOrPreviewService.getAvatarDisplayUrl(null);
  }

  async showToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}
