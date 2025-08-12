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
        this.platform.is('ios')
        // ||
        // this.platform.is('mobileweb') ||
        // this.platform.is('desktop')
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
      console.log('Modal dismissed with result:', result);
      if (result.data && result.data.type === 'predefined') {
        this.selectPredefinedAvatar(result.data.avatar);
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
        // Reset avatar prédéfini car on utilise un fichier personnalisé
        this.form.patchValue({ predefined_avatar: '' });

        console.log('Image de caméra sélectionnée:', {
          name: result.file.name,
          size: result.file.size,
          type: result.file.type,
        });
        this.showToast('Photo sélectionnée !', 'success');
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      this.showToast('Erreur lors de la prise de photo', 'warning');
    }
  }

  selectPredefinedAvatar(avatarPath: string) {
    console.log('=== SELECT PREDEFINED AVATAR ===');
    console.log('Avatar path reçu:', avatarPath);

    this.previewImage = avatarPath;
    this.selectedFile = null; // Reset le fichier car c'est un avatar prédéfini

    // Marquer que c'est un avatar prédéfini pour l'envoi au serveur
    this.form.patchValue({
      predefined_avatar: avatarPath,
    });

    console.log('Form après patchValue:');
    console.log(
      '- predefined_avatar:',
      this.form.get('predefined_avatar')?.value
    );
    console.log('- selectedFile:', this.selectedFile);
    console.log('- previewImage:', this.previewImage);
    console.log('=== FIN SELECT PREDEFINED AVATAR ===');

    this.showToast('Avatar sélectionné !', 'success');
  }

  // Méthode pour convertir un avatar prédéfini en fichier
  async convertAvatarToFile(avatarPath: string): Promise<File> {
    try {
      // Récupérer l'image depuis les assets
      const response = await fetch(avatarPath);
      const blob = await response.blob();

      // Extraire le nom du fichier depuis le chemin
      const fileName = avatarPath.split('/').pop() || 'avatar.jpg';

      // Créer un objet File à partir du Blob
      const file = new File([blob], fileName, { type: blob.type });

      console.log('Avatar converti en fichier:', {
        originalPath: avatarPath,
        fileName: file.name,
        size: file.size,
        type: file.type,
      });

      return file;
    } catch (error) {
      console.error("Erreur lors de la conversion de l'avatar:", error);
      throw new Error("Impossible de charger l'avatar sélectionné");
    }
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

    console.log('=== PREPARATION ENVOI API ===');
    console.log('selectedFile:', !!this.selectedFile);
    console.log('predefinedAvatar value:', predefinedAvatar);
    console.log('Form complet:', this.form.value);

    if (this.selectedFile) {
      // Avatar personnalisé uploadé
      formData.append('avatar', this.selectedFile);
      console.log('✅ Fichier avatar ajouté au FormData:', {
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        type: this.selectedFile.type,
      });
    } else if (predefinedAvatar) {
      // Avatar prédéfini sélectionné - convertir en fichier
      try {
        const avatarFile = await this.convertAvatarToFile(predefinedAvatar);
        formData.append('avatar', avatarFile);
        console.log(
          '✅ Avatar prédéfini converti en fichier et ajouté au FormData:',
          {
            name: avatarFile.name,
            size: avatarFile.size,
            type: avatarFile.type,
          }
        );
      } catch (error) {
        console.error("❌ Erreur lors de la conversion de l'avatar:", error);
        await loading.dismiss();
        this.showToast("Erreur lors du traitement de l'avatar", 'warning');
        return;
      }
    } else {
      console.log('❌ Aucun avatar sélectionné');
    }

    // Debug: Lister tout ce qui est dans le FormData
    console.log('=== CONTENU FORMDATA ===');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    console.log('=== FIN DEBUG FORMDATA ===');

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
