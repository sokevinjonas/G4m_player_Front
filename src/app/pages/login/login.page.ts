import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  login = {
    email: '',
    password: '',
  };
  backendErrors: string[] = [];

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private toast: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onLogin() {
    this.backendErrors = [];
    if (!this.validateForm()) {
      this.showToast('Veuillez remplir tous les champs.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Connexion...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();

    this.authentication
      .loginUser(this.login.email, this.login.password)
      .subscribe({
        next: async (response) => {
          await loading.dismiss();
          this.showToast('Connexion réussie !', 'success');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          // Stocke le token ou l'utilisateur ici si besoin
          localStorage.setItem('firstLaunch', 'true');
          this.router.navigate(['/tabs/home']);
        },
        error: async (error) => {
          await loading.dismiss();
          this.backendErrors = this.extractBackendErrors(error);
          console.error('Login failed:', error);
        },
      });
  }

  validateForm(): boolean {
    return this.login.email.trim() !== '' && this.login.password.trim() !== '';
  }

  onForgotPassword() {
    // Redirige ou affiche une modale de récupération
    this.showToast('Fonctionnalité à venir.', 'warning');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger'
  ) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    toast.present();
  }

  private extractBackendErrors(error: any): string[] {
    if (error?.error?.errors) {
      return Object.values(error.error.errors).reduce(
        (acc: string[], val) => acc.concat(val as string[]),
        []
      );
    } else if (error?.error?.message) {
      return [error.error.message];
    } else {
      return ['Une erreur est survenue.'];
    }
  }
}
