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
  };
  constructor(private router: Router) {}

  ngOnInit() {}

  onRegister() {
    // Ajoute ici ton appel API d'inscription
    console.log('Register:', this.register);
    // Redirige vers le dashboard ou la page de login après inscription
    this.router.navigate(['/tabs/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
