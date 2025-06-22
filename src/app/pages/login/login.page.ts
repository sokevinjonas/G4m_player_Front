import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}

  ngOnInit() {}
  onLogin() {
    // Ajoute ici ton appel API d'authentification
    console.log('Login:', this.login);
    // Redirige vers le dashboard après connexion réussie
    this.router.navigate(['/tabs/home']);
  }

  onForgotPassword() {
    // Redirige ou affiche une modale de récupération
    console.log('Mot de passe oublié');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
