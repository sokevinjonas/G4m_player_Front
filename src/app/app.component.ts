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
  async Initialisation() {
    const token = localStorage.getItem('token');
    const firstLaunch = localStorage.getItem('firstLaunch');

    // 1. Vérifier connexion réseau
    const isOnline = (await Network.getStatus()).connected;
    console.log('Network status:', isOnline);

    // La méthode isAuthenticated est maintenant synchrone
    if (token && firstLaunch) {
      if (this.authService.isAuthenticated()) {
        // Si le token existe localement, on suppose que l'utilisateur est connecté.
        // Le service d'authentification validera le token en arrière-plan.
        this.router.navigate(['/tabs/home']);
      } else {
        // Si le token n'est pas valide ou a été effacé
        this.handleSessionExpired();
      }
    } else {
      // Pas de token ou premier lancement
      this.router.navigate(['/welcome-screen']);
    }
  }

  private async handleSessionExpired() {
    localStorage.clear();
    await this.showToast(
      'Votre session a expiré. Veuillez vous reconnecter.',
      'warning'
    );
    this.router.navigate(['/welcome-screen']);
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
