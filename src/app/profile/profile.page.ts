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

  ionViewWillEnter() {
    // This method can be used to refresh data when the view is about to enter
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }
  goToNewPageAuthUser(url: string) {
    // Vérifie si l'utilisateur est authentifié
    if (this.user && this.user.id) {
      // Si l'utilisateur est authentifié, navigue vers la page demandée
      this.router.navigate([url]);
      return;
    }
    // Si l'utilisateur n'est pas authentifié, affficher un toast
    this.presentToast(
      'Veuillez vous connecter pour accéder à cette page',
      'warning'
    );
  }
  editProfile() {
    this.router.navigate(['/modifier-mon-profil']);
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
