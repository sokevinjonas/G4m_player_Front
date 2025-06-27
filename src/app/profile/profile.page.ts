import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { ToastController, AlertController } from '@ionic/angular';
import { FileSaveOrPreviewService } from '../core/services/fileSaveOrPreview/file-save-or-preview.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any = {};

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private alertController: AlertController,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService
  ) {}

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  get isUserAuthenticated(): boolean {
    return this.user && this.user.id;
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  ngOnInit() {
    this.loadUserData();
  }

  /**
   * Charge les données utilisateur depuis le localStorage
   */
  private loadUserData() {
    try {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User:', this.user);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des données utilisateur:',
        error
      );
      this.user = {};
    }
  }

  /**
   * Navigation vers une page pour utilisateur authentifié
   */
  goToNewPageAuthUser(url: string) {
    if (this.isUserAuthenticated) {
      this.router.navigate([url]);
      return;
    }
    this.presentToast(
      'Veuillez vous connecter pour accéder à cette page',
      'warning'
    );
  }

  /**
   * Navigation vers la page de création de compte
   */
  goToCreateAccount() {
    this.router.navigate(['/register']);
  }
  editProfile() {
    this.goToNewPageAuthUser('/modifier-mon-profil');
  }

  goToNotifications() {
    this.router.navigate(['/notification']);
  }

  openPrivacyPolicy() {
    this.router.navigate(['/politique']);
  }

  openUserGuide() {
    this.router.navigate(['/guide']);
  }

  goToSupport() {
    this.router.navigate(['/aides']);
  }

  async logout() {
    if (!this.isUserAuthenticated) {
      this.presentToast("Vous n'êtes pas connecté", 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Déconnexion',
          handler: () => {
            this.authService.logout().subscribe({
              next: () => {
                this.presentToast('Déconnexion réussie');
                this.router.navigate(['/welcome-screen']);
              },
              error: (err) => {
                this.presentToast('Veuillez vérifier votre connexion internet');
                console.error('Erreur:', err);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }
}
