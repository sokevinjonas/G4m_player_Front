import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { Router } from '@angular/router';

interface FakeMatch {
  id: number;
  competition_id: number;
  team1: { id: number; name: string; logo: string | null };
  team2: { id: number; name: string; logo: string | null };
  team1_score: number | null;
  team2_score: number | null;
  status: 'pending' | 'live' | 'completed' | 'scheduled';
  phase: string;
  competition: { name: string };
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
  fakeMatches: FakeMatch[] = [];

  constructor(protected apiService: ApiService, private router: Router) {
    this.initializeFakeMatches();
  }

  ionViewWillEnter() {
    this.getCompetitionsCountAllEnable();
    this.getGamesCountAll();
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }

  ngOnInit() {
    this.getCompetitionsCountAllEnable();
    this.getGamesCountAll();
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
  createAccount() {
    // navigate to the create account page
    console.log('Navigating to create account page');
    this.router.navigate(['/register']);
  }

  initializeFakeMatches() {
    this.fakeMatches = [
      {
        id: 1,
        competition_id: 1,
        team1: { id: 1, name: 'Dragons Esport', logo: null },
        team2: { id: 2, name: 'Phoenix Gaming', logo: null },
        team1_score: 2,
        team2_score: 1,
        status: 'completed',
        phase: 'final',
        competition: { name: 'Championnat Valorant' },
      },
      {
        id: 2,
        competition_id: 1,
        team1: { id: 3, name: 'Thunder Lions', logo: null },
        team2: { id: 4, name: 'Cyber Warriors', logo: null },
        team1_score: null,
        team2_score: null,
        status: 'pending',
        phase: 'semi_final',
        competition: { name: 'Championnat Valorant' },
      },
      {
        id: 3,
        competition_id: 2,
        team1: { id: 5, name: 'Alpha Squad', logo: null },
        team2: { id: 6, name: 'Beta Force', logo: null },
        team1_score: 1,
        team2_score: 3,
        status: 'completed',
        phase: 'quarter_final',
        competition: { name: 'Tournoi FIFA 24' },
      },
      {
        id: 4,
        competition_id: 2,
        team1: { id: 7, name: 'Gaming Elite', logo: null },
        team2: { id: 8, name: 'Pro Players', logo: null },
        team1_score: null,
        team2_score: null,
        status: 'live',
        phase: 'quarter_final',
        competition: { name: 'Tournoi FIFA 24' },
      },
      {
        id: 5,
        competition_id: 3,
        team1: { id: 9, name: 'Storm Riders', logo: null },
        team2: { id: 10, name: 'Night Hawks', logo: null },
        team1_score: 0,
        team2_score: 2,
        status: 'completed',
        phase: 'round_of_16',
        competition: { name: 'League of Legends Cup' },
      },
      {
        id: 6,
        competition_id: 3,
        team1: { id: 11, name: 'Apex Legends', logo: null },
        team2: { id: 12, name: 'Victory Squad', logo: null },
        team1_score: null,
        team2_score: null,
        status: 'pending',
        phase: 'round_of_16',
        competition: { name: 'League of Legends Cup' },
      },
      {
        id: 7,
        competition_id: 4,
        team1: { id: 13, name: 'Rocket Masters', logo: null },
        team2: { id: 14, name: 'Speed Demons', logo: null },
        team1_score: 4,
        team2_score: 2,
        status: 'completed',
        phase: 'final',
        competition: { name: 'Rocket League Championship' },
      },
      {
        id: 8,
        competition_id: 4,
        team1: { id: 15, name: 'Turbo Kings', logo: null },
        team2: { id: 16, name: 'Nitro Force', logo: null },
        team1_score: null,
        team2_score: null,
        status: 'scheduled',
        phase: 'semi_final',
        competition: { name: 'Rocket League Championship' },
      },
      {
        id: 9,
        competition_id: 5,
        team1: { id: 17, name: 'Shadow Ninjas', logo: null },
        team2: { id: 18, name: 'Light Brigade', logo: null },
        team1_score: 2,
        team2_score: 2,
        status: 'live',
        phase: 'quarter_final',
        competition: { name: 'CS:GO Major' },
      },
      {
        id: 10,
        competition_id: 5,
        team1: { id: 19, name: 'Fire Storm', logo: null },
        team2: { id: 20, name: 'Ice Wolves', logo: null },
        team1_score: 1,
        team2_score: 0,
        status: 'completed',
        phase: 'round_of_32',
        competition: { name: 'CS:GO Major' },
      },
    ];
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'À venir';
      case 'live':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'scheduled':
        return 'Programmé';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'medium';
      case 'live':
        return 'danger';
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
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
    return this.fakeMatches.slice(0, 5); // Afficher seulement les 5 premiers matches
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
