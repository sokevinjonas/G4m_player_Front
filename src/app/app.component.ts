import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from './core/services/authentication/authentication.service';
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
    private authService: AuthenticationService
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
  Initialisation() {
    const token = localStorage.getItem('token');
    const firstLaunch = localStorage.getItem('firstLaunch');

    if (token && firstLaunch) {
      // On vérifie si le token est encore valide
      this.authService.isAuthenticated().subscribe((isAuth) => {
        if (isAuth) {
          this.router.navigate(['/tabs/home']);
        } else {
          localStorage.clear();
          this.router.navigate(['/welcome-screen']);
        }
      });
    } else {
      this.router.navigate(['/welcome-screen']);
    }
  }
  async SplashScreen() {
    await SplashScreen.hide();
  }
}
