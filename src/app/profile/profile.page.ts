import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { ToastController, AlertController } from '@ionic/angular';

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
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    // This method can be used to refresh data when the view is about to enter
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }
  editProfile() {
    this.router.navigate(['/modifier-mon-profil']);
  }

  goToReferral() {
    this.router.navigate(['/parrainage']);
  }

  goToHistory() {
    this.router.navigate(['/historique']);
  }

  goToRanking() {
    this.router.navigate(['/classement']);
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    toast.present();
  }
}
