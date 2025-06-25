import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    referralCode: '', // champ optionnel
  };
  constructor(private router: Router) {}

  ngOnInit() {}

  onRegister() {
    if (!this.validateForm()) {
      console.error('Form validation failed');
      return;
    }
    console.log('Register:', this.register);
    this.router.navigate(['/tabs/home']);
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
