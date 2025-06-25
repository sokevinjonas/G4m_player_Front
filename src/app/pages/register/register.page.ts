import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  register = {
    id: '', // Ajout de l'id requis par UserRegister
    name: '',
    email: '',
    password: '',
    referralCode: '', // champ optionnel
  };
  constructor(
    private router: Router,
    private authentication: AuthenticationService
  ) {}

  ngOnInit() {}

  onRegister() {
    if (!this.validateForm()) {
      console.error('Form validation failed');
      return;
    }
    const userRegister = {
      id: this.register.id,
      name: this.register.name,
      email: this.register.email,
      password: this.register.password,
      referred_by: this.register.referralCode || undefined,
    };
    this.authentication.registerUser(userRegister).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/tabs/home']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
  validateForm() {
    // Implémente ici la logique de validation du formulaire
    return (
      this.register.name.trim() !== '' &&
      this.register.email.trim() !== '' &&
      this.register.password.trim() !== ''
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
