import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.page.html',
  styleUrls: ['./welcome-screen.page.scss'],
  standalone: false,
})
export class WelcomeScreenPage implements OnInit {
  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onConnect() {
    // Navigation vers la page de connexion
    // this.router.navigate(['/login']);

    // Ou afficher une alerte pour la démo
    const alert = await this.alertController.create({
      header: 'Connexion',
      message: 'Redirection vers la page de connexion',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async onCreateAccount() {
    // Navigation vers la page de création de compte
    // this.router.navigate(['/register']);

    // Ou afficher une alerte pour la démo
    const alert = await this.alertController.create({
      header: 'Créer un compte',
      message: 'Redirection vers la page de création de compte',
      buttons: ['OK'],
    });
    await alert.present();
  }

  onFeatureClick(feature: string) {
    console.log(`Feature clicked: ${feature}`);
    // Navigation vers la page correspondante
    // this.router.navigate([`/${feature}`]);
  }

  async onDashboardAccess() {
    // Navigation vers le dashboard
    this.router.navigate(['/tabs/home']);
  }
}
