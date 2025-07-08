import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { FileSaveOrPreviewService } from 'src/app/core/services/fileSaveOrPreview/file-save-or-preview.service';

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
  registrationStatus: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    public actionSheetCtrl: ActionSheetController,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const tournamentId = params['id'];
      this.user = JSON.parse(localStorage.getItem('user') || '{}');

      if (tournamentId) {
        this.getTournamentDetails(tournamentId);
      }
    });
    this.authenticationService.currentUser.subscribe((user) => {
      this.user = user;
      if (this.user && this.tournament) {
        this.checkRegistrationStatus();
      }
    });
  }

  getTournamentDetails(id: string) {
    // Délai minimum pour l'affichage du skeleton
    const minLoadingTime = 800; // 800ms minimum
    const startTime = Date.now();
    this.apiService.getCompetition(+id).subscribe((data) => {
      this.tournament = data;
      console.log('Tournament data:', this.tournament);

      // Calculer le temps écoulé et attendre le minimum si nécessaire
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      // La logique de participation sera ajoutée ici avec la nouvelle méthode
      if (this.user) {
        this.checkRegistrationStatus();
      }

      setTimeout(() => {
        this.loading = false;
      }, remainingTime);
    });
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  getRules(data: string): string[] {
    console.log('Data raw:', data);
    if (!data) return [];

    try {
      let parsed = JSON.parse(data);
      console.log('First parse:', parsed);

      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
        console.log('Second parse:', parsed);
      }

      // Handle array format (for rules)
      if (Array.isArray(parsed)) {
        return parsed;
      }

      // Handle object format (for rewards)
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed).map(([key, value]) => `${key}: ${value}`);
      }

      return [];
    } catch (error) {
      console.error('Erreur lors du parsing des données:', error);
      return [];
    }
  }
  getGameModeLabel(mode: string): string {
    switch (mode) {
      case 'un':
        return 'Solo (1 joueur)';
      case 'deux':
        return 'Duo (2 joueurs)';
      case 'trois':
        return 'Trio (3 joueurs)';
      case 'quatre':
        return 'Squad (4 joueurs)';
      case 'cinq':
        return 'équipe (5 joueurs)';
      case 'six':
        return 'équipe (6 joueurs)';
      case 'sept':
        return 'équipe (7 joueurs)';
      case 'huit':
        return 'équipe (8 joueurs)';
      case 'neuf':
        return 'équipe (9 joueurs)';
      case 'dix':
        return 'équipe (10 joueurs)';
      default:
        return 'Inconnu';
    }
  }

  checkRegistrationStatus() {
    if (
      this.tournament &&
      this.tournament.competitions &&
      this.tournament.competitions.length > 0
    ) {
      const competitionId = this.tournament.competitions[0].id;
      this.apiService.checkTeamRegistrationStatus(competitionId).subscribe(
        (status) => {
          this.registrationStatus = status;
        },
        (error) => {
          console.error('Error checking registration status', error);
          this.registrationStatus = { isRegistered: false };
        }
      );
    }
  }

  async createTeam() {
    // Logic to open a modal for team creation
    console.log('Create team clicked');
  }

  async manageTeam() {
    // Logic to open a modal for team management
    console.log('Manage team clicked');
  }

  login() {
    this.router.navigate(['/login']);
  }
}
