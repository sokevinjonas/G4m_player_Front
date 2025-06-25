import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss'],
  standalone: false,
})
export class TournamentsPage implements OnInit {
  competitions: any[] = [];

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    console.log('TournamentsPage: ionViewWillEnter');
    this.loadCompetitions();
  }
  ngOnInit() {
    console.log('TournamentsPage: ngOnInit');
    this.ionViewWillEnter();
  }

  loadCompetitions(event?: any) {
    this.api.getCompetitions().subscribe((data) => {
      this.competitions = data;
      console.log('Competitions:', this.competitions);
      if (event) {
        event.target.complete();
      }
    });
  }

  doRefresh(event: any) {
    this.loadCompetitions(event);
  }
}
