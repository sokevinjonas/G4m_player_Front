import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  myPoints: number = 0;
  myBadges: number = 0;
  tournoisDisponibles: number = 0;
  jeuxDisponibles: number = 0;
  user: any = {}; // Initialize user as an empty object
  constructor(protected apiService: ApiService) {}

  ionViewWillEnter() {
    this.getCompetitionsCountAllEnable();
    this.getGamesCountAll();
    this.getCompetitionsPoints();
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

  getCompetitionsPoints() {
    this.apiService.getCompetitionsPoints().subscribe((data) => {
      this.myPoints = data.points;
      console.log('Mes points:', data.points);
    });
  }

  getBadges() {
    this.apiService.getBadgesCount().subscribe((data) => {
      this.myBadges = data.count;
      console.log('Mes badges:', data.count);
    });
  }
}
