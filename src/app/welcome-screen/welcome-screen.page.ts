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
    this.router.navigate(['/login']);
  }

  async onCreateAccount() {
    // Navigation vers la page de création de compte
    this.router.navigate(['/register']);
  }

  async onDashboardAccess() {
    // localStorage.setItem('isConnected', 'true');
    localStorage.setItem('firstLaunch', 'true');
    // Navigation vers le dashboard
    this.router.navigate(['/tabs/home']);
  }
}
