import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { FileSaveOrPreviewService } from '../core/services/fileSaveOrPreview/file-save-or-preview.service';
import { WebsocketService } from '../core/services/websocket/websocket.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss'],
  standalone: false,
})
export class TournamentsPage implements OnInit, OnDestroy {
  competitions: any[] = [];
  filteredCompetitions: any[] = [];
  user: any = {};
  searchTerm: string = '';
  selectedStatus: string = 'Tous';
  isLoading: boolean = false;
  statusOptions: string[] = [
    'Tous',
    'À venir',
    'En cours',
    'Terminé',
    'Annulé',
  ];

  // WebSocket listeners
  private competitionListeners: any[] = [];

  // Propriétés pour les indicateurs temps réel
  isUpdating: boolean = false;
  showRealtimeToast: boolean = false;
  realtimeMessage: string = '';

  // Boutons pour le toast temps réel
  toastButtons = [
    {
      text: '✕',
      role: 'cancel',
    },
  ];

  constructor(
    private api: ApiService,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService,
    public websocketService: WebsocketService,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    console.log('TournamentsPage: ionViewWillEnter');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadCompetitions();
    this.setupWebSocketListeners();
  }

  ionViewWillLeave() {
    console.log('TournamentsPage: ionViewWillLeave');
    this.cleanupWebSocketListeners();
  }

  ngOnInit() {
    console.log('TournamentsPage: ngOnInit');
  }

  ngOnDestroy() {
    this.cleanupWebSocketListeners();
  }

  /**
   * Configurer les listeners WebSocket
   */
  private setupWebSocketListeners() {
    // Nettoyer les anciens listeners
    this.cleanupWebSocketListeners();

    // Écouter les mises à jour générales
    this.websocketService.listenToAdminDashboard((data: any) => {
      this.handleNewParticipant(data);
    });

    // Écouter chaque compétition individuellement
    this.competitions.forEach((competition) => {
      const listener = this.websocketService.listenToCompetition(
        competition.id,
        (data: any) => {
          this.handleCompetitionUpdate(competition.id, data);
        }
      );
      if (listener) {
        this.competitionListeners.push({
          competitionId: competition.id,
          listener,
        });
      }
    });

    console.log(
      `🔧 ${this.competitionListeners.length} listeners WebSocket configurés`
    );
  }

  /**
   * Nettoyer les listeners WebSocket
   */
  private cleanupWebSocketListeners() {
    this.competitionListeners.forEach(({ competitionId }) => {
      this.websocketService.stopListening(`competitions.${competitionId}`);
    });
    this.competitionListeners = [];

    this.websocketService.stopListening('admin-dashboard');
  }

  /**
   * Gérer les nouvelles inscriptions
   */
  private async handleNewParticipant(data: any) {
    console.log('🎉 Nouvelle inscription détectée:', data);

    // Activer l'indicateur de mise à jour
    this.isUpdating = true;

    // Mettre à jour la compétition concernée
    const competitionIndex = this.competitions.findIndex(
      (comp) => comp.id === data.competition.id
    );

    if (competitionIndex !== -1) {
      // Marquer la compétition comme récemment mise à jour
      this.competitions[competitionIndex].justUpdated = true;
      this.competitions[competitionIndex].participantCountUpdated = true;

      // Mettre à jour les données de la compétition
      this.competitions[competitionIndex].current_participants =
        data.current_participants;
      this.competitions[competitionIndex].max_participants =
        data.max_participants;

      // Si la compétition est maintenant pleine
      if (data.current_participants >= data.max_participants) {
        this.competitions[competitionIndex].status = 'full';
      }

      // Réappliquer les filtres pour mettre à jour l'affichage
      this.applyFilters();

      // Afficher le toast temps réel
      this.showRealtimeToast = true;
      this.realtimeMessage = data.message || '🎉 Nouvelle inscription !';

      // Désactiver les indicateurs après un délai
      setTimeout(() => {
        this.competitions[competitionIndex].justUpdated = false;
        this.competitions[competitionIndex].participantCountUpdated = false;
        this.isUpdating = false;
      }, 3000);

      // Afficher une notification toast standard
      await this.showToast(data.message, 'success');
    } else {
      this.isUpdating = false;
    }
  }

  /**
   * Gérer les mises à jour spécifiques à une compétition
   */
  private async handleCompetitionUpdate(competitionId: number, data: any) {
    console.log(`🔄 Mise à jour compétition ${competitionId}:`, data);

    // Activer l'indicateur de mise à jour
    this.isUpdating = true;

    const competitionIndex = this.competitions.findIndex(
      (comp) => comp.id === competitionId
    );

    if (competitionIndex !== -1) {
      // Marquer la compétition comme récemment mise à jour
      this.competitions[competitionIndex].justUpdated = true;
      this.competitions[competitionIndex].participantCountUpdated = true;

      // Mettre à jour les données
      this.competitions[competitionIndex] = {
        ...this.competitions[competitionIndex],
        current_participants: data.current_participants,
        max_participants: data.max_participants,
        status:
          data.current_participants >= data.max_participants
            ? 'full'
            : this.competitions[competitionIndex].status,
      };

      this.applyFilters();

      // Afficher le toast temps réel
      this.showRealtimeToast = true;
      this.realtimeMessage = `🔄 Compétition "${this.competitions[competitionIndex].tournoi?.name}" mise à jour`;

      // Désactiver les indicateurs après un délai
      setTimeout(() => {
        this.competitions[competitionIndex].justUpdated = false;
        this.competitions[competitionIndex].participantCountUpdated = false;
        this.isUpdating = false;
      }, 3000);
    } else {
      this.isUpdating = false;
    }
  }

  /**
   * Afficher un toast de notification
   */
  private async showToast(message: string, color: string = 'medium') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      buttons: [
        {
          text: '✕',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  loadCompetitions(event?: any) {
    if (!event) {
      this.isLoading = true;
    }

    console.log('Chargement des compétitions...');

    this.api.getCompetitions().subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.competitions = data || [];

        // Pour chaque compétition, vérifier si l'utilisateur est inscrit
        this.competitions.forEach((comp) => {
          comp.isUserRegistered =
            comp.players &&
            comp.players.some((p: any) => p.id === this.user.id);
        });

        // Initialiser les compétitions filtrées
        this.filteredCompetitions = [...this.competitions];
        this.applyFilters();

        // Reconfigurer les listeners WebSocket avec les nouvelles compétitions
        this.setupWebSocketListeners();

        console.log('Competitions chargées:', this.competitions.length);

        this.isLoading = false;

        if (event) {
          event.target.complete();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des compétitions:', error);

        this.isLoading = false;

        if (event) {
          event.target.complete();
        }
      },
    });
  }

  // ... rest of your existing methods remain the same ...

  selectStatus(status: string | undefined) {
    if (!status) return;
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.competitions];

    if (this.selectedStatus !== 'Tous') {
      const statusMap: { [key: string]: string } = {
        'À venir': 'upcoming',
        'En cours': 'ongoing',
        Terminé: 'completed',
        Annulé: 'cancelled',
      };
      const apiStatus = statusMap[this.selectedStatus];
      filtered = filtered.filter((comp) => comp.status === apiStatus);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (comp) =>
          comp.tournoi?.name?.toLowerCase().includes(term) ||
          comp.game?.name?.toLowerCase().includes(term) ||
          comp.description?.toLowerCase().includes(term)
      );
    }

    this.filteredCompetitions = filtered;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'Tous';
    this.applyFilters();
  }

  doRefresh(event: any) {
    console.log('Rafraîchissement manuel des données...');
    this.loadCompetitions(event);
  }

  forceRefresh() {
    console.log('Rafraîchissement forcé des données...');
    this.competitions = [];
    this.filteredCompetitions = [];
    this.loadCompetitions();
  }

  /**
   * Méthode de tracking pour optimiser le rendu
   */
  trackByCompetitionId(index: number, competition: any): number {
    return competition.id;
  }

  /**
   * Forcer la reconnexion WebSocket
   */
  reconnectWebSocket() {
    console.log('🔄 Reconnexion WebSocket forcée...');
    this.websocketService.resetAndRetryAllClusters();

    // Reconfigurer les listeners après reconnexion
    setTimeout(() => {
      this.setupWebSocketListeners();
    }, 3000);
  }

  /**
   * Obtenir le statut de connexion WebSocket
   */
  getWebSocketStatus() {
    return this.websocketService.getConnectionStatus();
  }
}
