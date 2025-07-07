import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../../core/services/api/api.service';
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

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    if (id) {
      this.loadDataCompetition(+id);
    }
    console.log('User:', this.user);
  }

  loadDataCompetition(id: number) {
    // Délai minimum pour l'affichage du skeleton
    const minLoadingTime = 800; // 800ms minimum
    const startTime = Date.now();
    this.api.getCompetition(id).subscribe((data) => {
      this.tournament = data;
      console.log('Tournament data:', this.tournament);

      // Calculer le temps écoulé et attendre le minimum si nécessaire
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      // Vérifie la participation seulement si user et tournoi existent
      if (this.user?.id && this.tournament?.id) {
        this.api
          .checkExistingParticipation(this.tournament.id)
          .subscribe((res) => {
            this.participation = res;
            console.log('Participation:', this.participation);
          });
      }
      setTimeout(() => {
        this.loading = false;
      }, remainingTime);
    });
  }

  async registerForTournament() {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token || this.participation === null) {
      await this.showLoginAlert();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment vous inscrire à ce tournoi ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            this.showToast('Inscription annulée', 'medium');
          },
        },
        {
          text: 'Oui',
          handler: () => {
            this.proceedRegistration();
          },
        },
      ],
    });

    await alert.present();
  }

  private async showLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Connexion requise',
      message:
        'Vous devez créer un compte ou vous connecter pour vous inscrire à ce tournoi.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            this.showToast('Inscription annulée', 'medium');
          },
        },
        {
          text: 'Créer un compte',
          handler: () => {
            this.router.navigate(['/register']);
          },
        },
      ],
    });

    await alert.present();
  }

  private proceedRegistration() {
    if (this.user?.id && this.tournament?.id) {
      const userData = {
        user_id: this.user.id,
        competition_id: this.tournament.id,
      };
      this.api.registerToCompetition(userData.competition_id).subscribe(
        (response) => {
          console.log('Inscription réussie:', response);
          // Mettre à jour la participation locale
          this.loadDataCompetition(userData.competition_id);
          this.participation = { exists: true };
          this.showToast('Inscription réussie !', 'success');
        },
        (error) => {
          console.error("Erreur lors de l'inscription:", error);
          this.showToast("Erreur lors de l'inscription", 'danger');
        }
      );
    } else {
      console.error('Utilisateur ou tournoi non défini');
      this.showToast('Erreur: données manquantes', 'danger');
    }
  }

  async showUnregisterAlert() {
    const alert = await this.alertController.create({
      header: 'Désinscription',
      message:
        'Vous êtes déjà inscrit à ce tournoi. Souhaitez-vous vous désinscrire ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            this.showToast('Désinscription annulée', 'medium');
          },
        },
        {
          text: 'Oui',
          handler: () => {
            this.proceedUnregistration();
          },
        },
      ],
    });

    await alert.present();
  }

  private proceedUnregistration() {
    this.api.unregisterToCompetition(this.tournament.id).subscribe(
      (response) => {
        console.log('Désinscription réussie:', response);
        this.loadDataCompetition(this.tournament.id);
        this.updateParticipationAfterUnregistration();
      },
      (error) => {
        console.error('Erreur lors de la désinscription:', error);
        this.showToast('Erreur lors de la désinscription', 'danger');
      }
    );
  }

  private updateParticipationAfterUnregistration() {
    this.participation = { exists: false };
    this.showToast('Désinscription réussie !', 'success');
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
}
