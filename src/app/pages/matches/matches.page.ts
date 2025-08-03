import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';

interface Match {
  id: number;
  competition_id: number;
  team1: { id: number; name: string; logo: string | null };
  team2: { id: number; name: string; logo: string | null };
  team1_score: number | null;
  team2_score: number | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  phase: string;
  competition: { name: string; title: string };
  scheduled_at: string | null;
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  standalone: false,
})
export class MatchesPage implements OnInit {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedStatus: string = 'À venir';
  statusOptions: string[] = ['À venir', 'En cours', 'Terminé', 'Annulé'];
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadMatches();
  }

  doRefresh(event?: any) {
    this.loadMatches();
    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
  }

  loadMatches() {
    this.isLoading = true;
    this.apiService.getMatches().subscribe({
      next: (response) => {
        this.matches = response.data || [];
        this.applyFilters();
        this.isLoading = false;
        console.log('Matches chargés:', this.matches);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matches:', error);
        this.isLoading = false;
        this.matches = [];
        this.filteredMatches = [];
      },
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'À venir';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'medium';
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'danger';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'dark';
      default:
        return 'medium';
    }
  }

  getPhaseLabel(phase: string): string {
    switch (phase) {
      case 'final':
        return 'Finale';
      case 'semi_final':
        return 'Demi-finale';
      case 'quarter_final':
        return 'Quart de finale';
      case 'round_of_16':
        return '8ème de finale';
      case 'round_of_32':
        return '16ème de finale';
      default:
        return phase;
    }
  }

  selectStatus(event: any) {
    const status = event as string;
    if (!status) return;
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.matches];

    if (this.selectedStatus && this.selectedStatus !== 'pending') {
      const statusMap: { [key: string]: string } = {
        'À venir': 'pending',
        'En cours': 'in_progress',
        Terminé: 'completed',
        Annulé: 'cancelled',
      };
      const apiStatus = statusMap[this.selectedStatus];
      if (apiStatus) {
        filtered = filtered.filter((match) => match.status === apiStatus);
      }
    }

    this.filteredMatches = filtered;
  }
}
