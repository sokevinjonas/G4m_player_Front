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

  constructor(
    private api: ApiService,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService
  ) {}

  ionViewWillEnter() {
    console.log('TournamentsPage: ionViewWillEnter');
    // Rafraîchir les données utilisateur à chaque entrée sur la page
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // Toujours recharger les compétitions pour avoir les données les plus récentes
    this.loadCompetitions();
  }

  ngOnInit() {
    console.log('TournamentsPage: ngOnInit');
    // Pas besoin de charger ici car ionViewWillEnter sera appelé après
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

  /**
   * Filtrer les compétitions par statut
   */
  selectStatus(status: string | undefined) {
    if (!status) return;
    this.selectedStatus = status;
    this.applyFilters();
  }

  /**
   * Filtrer les compétitions par terme de recherche
   */
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  /**
   * Appliquer tous les filtres (statut et recherche)
   */
  applyFilters() {
    let filtered = [...this.competitions];

    // Filtrer par statut
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

    // Filtrer par terme de recherche
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

  /**
   * Réinitialiser tous les filtres
   */
  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'Tous';
    this.applyFilters();
  }

  doRefresh(event: any) {
    console.log('Rafraîchissement manuel des données...');
    this.loadCompetitions(event);
  }

  /**
   * Méthode pour forcer le rafraîchissement des données
   * Utile pour debugger ou forcer la mise à jour
   */
  forceRefresh() {
    console.log('Rafraîchissement forcé des données...');
    this.competitions = [];
    this.filteredCompetitions = [];
    this.loadCompetitions();
  }
}
