import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  myBadges: number = 0;
  tournoisDisponibles: number = 0;
  jeuxDisponibles: number = 0;
  user: any = {}; // Initialize user as an empty object
  constructor(protected apiService: ApiService, private router: Router) {}

  ionViewWillEnter() {
    this.getCompetitionsCountAllEnable();
    this.getGamesCountAll();
    this.getBadges();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }

  getCompetitionsCountAllEnable() {
    this.apiService.getCompetitionsCountAllEnable().subscribe((data) => {
      this.tournoisDisponibles = data.count;
      console.log('Tournois disponibles:', data.count);
    });
  }

  getGamesCountAll() {
    this.apiService.getGamesCountAll().subscribe((data) => {
      this.jeuxDisponibles = data.count;
      console.log('Jeux disponibles:', data.count);
    });
  }

  getBadges() {
    this.apiService.getBadgesCount().subscribe((data) => {
      this.myBadges = data.count;
      console.log('Mes badges:', data.count);
    });
  }
  createAccount() {
    // navigate to the create account page
    console.log('Navigating to create account page');
    this.router.navigate(['/register']);
  }
}
