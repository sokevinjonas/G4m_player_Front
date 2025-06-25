import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  register = {
    name: '',
    email: '',
    password: '',
    referralCode: '',
  };
  backendErrors: string[] = [];

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private toast: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onRegister() {
    this.backendErrors = [];
    if (!this.validateForm()) {
      this.showToast(
        'Veuillez remplir tous les champs obligatoires.',
        'warning'
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Inscription en cours...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loading.present();

    const userRegister = {
      name: this.register.name,
      email: this.register.email,
      password: this.register.password,
      referred_by: this.register.referralCode || undefined,
    };

    this.authentication.registerUser(userRegister).subscribe({
      next: async () => {
        await loading.dismiss();
        this.showToast(
          'Inscription réussie, Veuillez vous connecter !',
          'success'
        );
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        await loading.dismiss();
        this.backendErrors = this.extractBackendErrors(error);
        console.error('Registration failed:', error);
      },
    });
  }

  validateForm(): boolean {
    return (
      this.register.name.trim() !== '' &&
      this.register.email.trim() !== '' &&
      this.register.password.trim() !== ''
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
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
