import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';

@Component({
  selector: 'app-show-tournament',
  templateUrl: './show-tournament.page.html',
  styleUrls: ['./show-tournament.page.scss'],
  standalone: false,
})
export class ShowTournamentPage implements OnInit {
  tournament: any = null;
  loading = true;
  user: any = {};

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getCompetition(+id).subscribe((data) => {
        this.tournament = data;
        this.loading = false;
      });
    }
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }
}
