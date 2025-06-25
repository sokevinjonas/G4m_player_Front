import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  }
  ngOnInit() {
    // Initialisation du statut de la barre
    this.Initialisation();
  }
  Initialisation() {
    const isConnected = localStorage.getItem('isConnected');
    const firstLaunch = localStorage.getItem('firstLaunch');
    if (isConnected === 'true' || firstLaunch != null) {
      // Si l'utilisateur est connecté,  rediriger vers le dashboard
      this.router.navigate(['/tabs/home']);
    } else if (firstLaunch === null) {
      // Si l'utilisateur n'est pas connecté, rediriger vers l'écran de bienvenue
      // this.router.navigate(['/welcome-screen']);
      this.router.navigate(['/login']);
    }
  }
}
