import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { Router } from '@angular/router';

interface Match {
  id: number;
  competition_id: number;
  team1: { id: number; name: string; logo: string | null };
  team2: { id: number; name: string; logo: string | null };
  team1_score: number | null;
  team2_score: number | null;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  phase: string;
  competition: { name: string; title: string };
  scheduled_at: string | null;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  myBadges: number = 0;
  tournoisDisponibles: number = 0;
  jeuxDisponibles: number = 0;
  user: any = {}; // Initialize user as an empty object
  matches: Match[] = [];
  isLoadingMatches: boolean = false;

  constructor(protected apiService: ApiService, private router: Router) {
    // Plus besoin d'initialiser de faux matches
  }

  ionViewWillEnter() {
    this.getCompetitionsCountAllEnable();
    this.getGamesCountAll();
    this.loadMatches();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }

  ngOnInit() {
    this.getCompetitionsCountAllEnable();
    this.getGamesCountAll();
    this.loadMatches();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }

  getCompetitionsCountAllEnable() {
    this.apiService.getCompetitionsCountAllEnable().subscribe((data) => {
      this.tournoisDisponibles = data.count;
      console.log('Tournois disponibles:', data.count);
    });
  }

  getGamesCountAll() {
    this.apiService.getGamesCountAll().subscribe((data) => {
      this.jeuxDisponibles = data.count;
      console.log('Jeux disponibles:', data.count);
    });
  }

  loadMatches() {
    this.isLoadingMatches = true;
    // Charger seulement les 5 derniers matches
    this.apiService.getMatches({ page: 1 }).subscribe({
      next: (response) => {
        this.matches = response.data || [];
        this.isLoadingMatches = false;
        console.log('Matches chargés:', this.matches);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matches:', error);
        this.isLoadingMatches = false;
        // En cas d'erreur, garder un tableau vide
        this.matches = [];
      },
    });
  }

  createAccount() {
    // navigate to the create account page
    console.log('Navigating to create account page');
    this.router.navigate(['/register']);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'À venir';
      case 'scheduled':
        return 'Programmé';
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

  getRecentMatches() {
    return this.matches.slice(0, 5); // Afficher seulement les 5 premiers matches
  }

  viewAllMatches() {
    this.router.navigate(['/matches']);
  }

  /**
   * Ouvre les liens des réseaux sociaux
   */
  openSocialLink(platform: string) {
    const socialLinks = {
      facebook: 'https://www.facebook.com/share/1EkPQz3q6U/',
      whatsapp: 'https://chat.whatsapp.com/B5dsn3ZhOiXGy5ornLBfOc',
      tiktok: 'https://www.tiktok.com/@g4meproafrica',
    };

    const url = socialLinks[platform as keyof typeof socialLinks];
    if (url) {
      window.open(url, '_blank');
    }
  }
}
