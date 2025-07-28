import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform, ToastController } from '@ionic/angular';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthenticationService,
    private toastController: ToastController
  ) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay: false });
    }
    this.SplashScreen();
  }
  ngOnInit() {
    // Initialisation du statut de la barre
    this.Initialisation();
  }
  ionViewWillEnter() {
    // Vérification de la connexion réseau
    this.Initialisation();
  }
  async Initialisation() {
    const firstLaunch = localStorage.getItem('firstLaunch');

    // 1. Vérifier connexion réseau
    const isOnline = (await Network.getStatus()).connected;
    console.log('Network status:', isOnline);

    if (this.authService.isAuthenticated() && firstLaunch) {
      if (isOnline) {
        // On vérifie si le token est encore valide
        this.authService.isAuthenticatedValide().subscribe({
          next: (isAuth) => {
            if (isAuth) {
              this.router.navigate(['/tabs/home']);
              // this.router.navigate(['/tabs/tournaments']); //tournaments
            } else {
              this.handleSessionExpired();
            }
          },
          error: (error) => {
            console.error('Erreur lors de la vérification du token:', error);
            this.handleSessionExpired();
          },
        });
      } else {
        // Si pas de connexion, on redirige vers l'écran d'onboarding
        this.showToast('Aucune connexion réseau détectée', 'warning');
        this.router.navigate(['/onboarding']);
      }
    } else {
      // this.router.navigate(['/onboarding']); //tournaments
      this.router.navigate(['/tabs/classement']); //tournaments
    }
  }

  private async handleSessionExpired() {
    localStorage.clear();
    await this.showToast(
      'Votre session a expiré. Veuillez vous reconnecter.',
      'warning'
    );
    this.router.navigate(['/onboarding']);
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      buttons: [
        {
          text: 'Fermer',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
  async SplashScreen() {
    await SplashScreen.hide();
  }
}
