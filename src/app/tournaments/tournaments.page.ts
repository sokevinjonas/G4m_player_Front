import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { FileSaveOrPreviewService } from '../core/services/fileSaveOrPreview/file-save-or-preview.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss'],
  standalone: false,
})
export class TournamentsPage implements OnInit {
  competitions: any[] = [];
  user: any = {};

  constructor(
    private api: ApiService,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService
  ) {}

  ionViewWillEnter() {
    console.log('TournamentsPage: ionViewWillEnter');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // Vérifier si la liste doit être mise à jour après une inscription
    const needsUpdate = localStorage.getItem('tournamentListNeedsUpdate');
    if (needsUpdate === 'true') {
      localStorage.removeItem('tournamentListNeedsUpdate');
      this.loadCompetitions();
    } else {
      this.loadCompetitions();
    }
  }
  ngOnInit() {
    console.log('TournamentsPage: ngOnInit');
    this.ionViewWillEnter();
  }

  loadCompetitions(event?: any) {
    this.api.getCompetitions().subscribe((data) => {
      this.competitions = data;

      // Pour chaque compétition, vérifier si l'utilisateur est inscrit
      this.competitions.forEach((comp) => {
        comp.isUserRegistered =
          comp.players && comp.players.some((p: any) => p.id === this.user.id);
      });

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
