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

  ngOnInit() {
    this.loadCompetitions();
  }

  loadCompetitions(event?: any) {
    this.api.getCompetitions().subscribe((data) => {
      this.competitions = data;
      if (event) {
        event.target.complete();
      }
    });
  }

  doRefresh(event: any) {
    this.loadCompetitions(event);
  }
}
