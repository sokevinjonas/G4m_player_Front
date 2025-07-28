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
import { CreateTeamModalComponent } from 'src/app/components/create-team-modal/create-team-modal.component';

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
  registrationStatus: any;
  teamByCompetition: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    protected authenticationService: AuthenticationService,
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
      console.log('tournamentId:', tournamentId);

      if (tournamentId) {
        this.getTournamentDetails(tournamentId);
        this.checkRegistrationStatus(tournamentId);
        this.LoadteamByCompetition(+tournamentId);
      }
    });
  }

  LoadteamByCompetition(id: number) {
    this.apiService.teamByCompetition(id).subscribe(
      (data) => {
        this.teamByCompetition = data;
        console.log('Team by competition:', this.teamByCompetition);
      },
      (error) => {
        console.error('Error fetching team by competition:', error);
        this.showToast('Erreur lors de la récupération de l’équipe.', 'danger');
      }
    );
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
        this.checkRegistrationStatus(this.tournament.id);
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
    // console.log('Data raw:', data);
    if (!data) return [];

    try {
      let parsed = JSON.parse(data);
      // console.log('First parse:', parsed);

      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
        // console.log('Second parse:', parsed);
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

  checkRegistrationStatus(tournamentId: number) {
    this.apiService.checkTeamRegistrationStatus(tournamentId).subscribe(
      (status) => {
        console.log(' status:', status);
        this.registrationStatus = { isRegistered: status.is_registered };
      },
      (error) => {
        this.registrationStatus = { isRegistered: false };
      }
    );
  }

  async createTeam() {
    if (this.tournament.mode === 'un') {
      const alert = await this.alertController.create({
        header: 'Inscription Solo',
        message:
          "Veuillez saisir votre pseudo ou ID de jeu pour l'inscription :",
        inputs: [
          {
            name: 'gameId',
            type: 'text',
            placeholder: 'Pseudo ou ID du jeu',
          },
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
          },
          {
            text: 'Valider',
            handler: (data: { gameId: string }) => {
              if (!data.gameId || !data.gameId.trim()) {
                this.showToast(
                  'Veuillez saisir un pseudo ou ID valide.',
                  'danger'
                );
                return false;
              }

              // Correction ici : on envoie un objet, pas une string
              this.apiService
                .createTeamAndParticipate(this.tournament.id, {
                  team_name: data.gameId,
                })
                .subscribe(
                  (_response: any) => {
                    this.showToast('Inscription solo réussie !', 'success');
                    this.getTournamentDetails(this.tournament.id);
                    this.checkRegistrationStatus(this.tournament.id);
                    this.LoadteamByCompetition(this.tournament.id);
                  },
                  (_error: any) => {
                    this.showToast(
                      "Erreur lors de l'inscription solo.",
                      'danger'
                    );
                  }
                );
              return true;
            },
          },
        ],
      });
      await alert.present();
      return;
    } else {
      const modal = await this.modalController.create({
        component: CreateTeamModalComponent,
        componentProps: {
          competitionId: this.tournament.id,
        },
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data && data.teamData) {
        this.apiService
          .createTeamAndParticipate(this.tournament.id, data.teamData)
          .subscribe(
            (response) => {
              this.showToast(
                'Équipe créée et inscrite avec succès!',
                'success'
              );
              this.checkRegistrationStatus(this.tournament.id);
              this.LoadteamByCompetition(this.tournament.id);
              // Émettre un événement pour informer la page des tournois
              this.notifyTournamentListUpdate();
            },
            (error) => {
              console.error('Error creating team', error);
              this.showToast(
                "Erreur lors de la création de l'équipe.",
                'danger'
              );
            }
          );
      }
    }
  }

  /**
   * Traite les récompenses depuis le format JSON de l'API
   */
  getRewardsArray(): { position: string; prize: string }[] {
    if (!this.tournament?.reward) return [];

    try {
      const rewards = JSON.parse(this.tournament.reward);
      return Object.entries(rewards).map(([position, prize]) => ({
        position,
        prize: prize as string,
      }));
    } catch (error) {
      console.error('Erreur lors du parsing des récompenses:', error);
      return [];
    }
  }

  /**
   * Traite les règles depuis le format JSON de l'API
   */
  getRulesArray(): string[] {
    if (!this.tournament?.rules) return [];

    try {
      const rules = JSON.parse(this.tournament.rules);
      return Array.isArray(rules) ? rules : [];
    } catch (error) {
      console.error('Erreur lors du parsing des règles:', error);
      return [];
    }
  }

  /**
   * Traite les liens de contact depuis le format JSON de l'API
   */
  getContactLinks(): { type: string; url: string; icon: string }[] {
    if (!this.tournament?.contact_link) return [];

    try {
      const contacts = JSON.parse(this.tournament.contact_link);
      return Array.isArray(contacts) ? contacts : [];
    } catch (error) {
      console.error('Erreur lors du parsing des liens de contact:', error);
      return [];
    }
  }

  /**
   * Retourne l'icône appropriée pour le type de contact
   */
  getContactIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'whatsapp':
        return 'logo-whatsapp';
      case 'facebook':
        return 'logo-facebook';
      case 'instagram':
        return 'logo-instagram';
      case 'discord':
        return 'logo-discord';
      case 'telegram':
        return 'paper-plane-outline';
      default:
        return 'link-outline';
    }
  }

  /**
   * Notifie la page des tournois qu'une inscription a eu lieu
   * pour qu'elle puisse mettre à jour la liste
   */
  private notifyTournamentListUpdate() {
    // Stocker dans localStorage pour informer la page des tournois
    localStorage.setItem('tournamentListNeedsUpdate', 'true');
  }

  login() {
    this.router.navigate(['/login']);
  }
}
