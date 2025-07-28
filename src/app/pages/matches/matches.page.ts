import { Component, OnInit } from '@angular/core';

interface Match {
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
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  standalone: false,
})
export class MatchesPage implements OnInit {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedStatus: string = 'Tous';
  statusOptions: string[] = [
    'Tous',
    'À venir',
    'En cours',
    'Terminé',
    'Programmé',
  ];

  constructor() {
    this.initializeMatches();
  }

  ngOnInit() {
    this.filteredMatches = [...this.matches];
  }

  initializeMatches() {
    this.matches = [
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
      {
        id: 11,
        competition_id: 6,
        team1: { id: 21, name: 'Mystic Warriors', logo: null },
        team2: { id: 22, name: 'Solar Flare', logo: null },
        team1_score: null,
        team2_score: null,
        status: 'pending',
        phase: 'quarter_final',
        competition: { name: 'Fortnite Battle Royale' },
      },
      {
        id: 12,
        competition_id: 6,
        team1: { id: 23, name: 'Neon Knights', logo: null },
        team2: { id: 24, name: 'Cosmic Raiders', logo: null },
        team1_score: 3,
        team2_score: 1,
        status: 'completed',
        phase: 'semi_final',
        competition: { name: 'Fortnite Battle Royale' },
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

  selectStatus(event: any) {
    const status = event as string;
    if (!status) return;
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.matches];

    if (this.selectedStatus !== 'Tous') {
      const statusMap: { [key: string]: string } = {
        'À venir': 'pending',
        'En cours': 'live',
        Terminé: 'completed',
        Programmé: 'scheduled',
      };
      const apiStatus = statusMap[this.selectedStatus];
      filtered = filtered.filter((match) => match.status === apiStatus);
    }

    this.filteredMatches = filtered;
  }
}
