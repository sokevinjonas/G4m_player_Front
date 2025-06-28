import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform, private router: Router) {
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
  Initialisation() {
    const token = localStorage.getItem('token');
    const firstLaunch = localStorage.getItem('firstLaunch');
    if (token != null && firstLaunch != null) {
      // Si l'utilisateur est connecté,  rediriger vers le dashboard
      // this.router.navigate(['/tabs/home']);
      this.router.navigate(['/tabs/profile']);
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers l'écran de bienvenue
      this.router.navigate(['/welcome-screen']);
      // this.router.navigate(['/tabs/tournament']);
    }
  }
  async SplashScreen() {
    // Afficher l'écran de démarrage pendant 2 secondes
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}
