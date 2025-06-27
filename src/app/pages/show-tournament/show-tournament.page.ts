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
  participation: any = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (id) {
      this.api.getCompetition(+id).subscribe((data) => {
        this.tournament = data;
        this.loading = false;

        // Vérifie la participation seulement si user et tournoi existent
        if (this.user?.id && this.tournament?.id) {
          this.api
            .checkExistingParticipation(this.tournament.id)
            .subscribe((res) => {
              this.participation = res;
            });
        }
      });
    }
    console.log('User:', this.user);
  }
  registerForTournament() {
    if (this.user?.id && this.tournament?.id) {
      const userData = {
        user_id: this.user.id,
        competition_id: this.tournament.id,
      };
      this.api.registerToCompetition(this.tournament.id, userData).subscribe(
        (response) => {
          console.log('Inscription réussie:', response);
          // Mettre à jour la participation locale
          this.participation = response;
        },
        (error) => {
          console.error("Erreur lors de l'inscription:", error);
        }
      );
    } else {
      console.error('Utilisateur ou tournoi non défini');
    }
  }

  getRules(rules: string): string[] {
    console.log('Rules raw:', rules);
    try {
      let parsed = JSON.parse(rules);
      console.log('First parse:', parsed);

      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
        console.log('Second parse:', parsed);
      }

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erreur lors du parsing des règles:', error);
      return [];
    }
  }
}
