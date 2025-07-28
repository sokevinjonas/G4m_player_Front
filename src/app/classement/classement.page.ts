import { Component, OnInit } from '@angular/core';

interface Player {
  id: number;
  username: string;
  avatar: string | null;
  points: number;
  country: string;
  countryFlag: string;
  rank: number;
  previousRank?: number;
  isCurrentUser?: boolean;
}

interface Game {
  id: number;
  name: string;
  icon: string;
  color: string;
  totalPlayers: number;
}

@Component({
  selector: 'app-classement',
  templateUrl: './classement.page.html',
  styleUrls: ['./classement.page.scss'],
  standalone: false,
})
export class ClassementPage implements OnInit {
  selectedGame: Game | null = null;
  selectedRankingType: 'general' | 'country' = 'general';
  userCountry = 'Cameroun'; // Pays de l'utilisateur connecté
  currentUserId = 5; // ID de l'utilisateur connecté

  games: Game[] = [
    {
      id: 1,
      name: 'Valorant',
      icon: 'game-controller',
      color: '#FF4654',
      totalPlayers: 1250,
    },
    {
      id: 2,
      name: 'FIFA 24',
      icon: 'football',
      color: '#00D4AA',
      totalPlayers: 2100,
    },
    {
      id: 3,
      name: 'League of Legends',
      icon: 'shield',
      color: '#C89B3C',
      totalPlayers: 980,
    },
    {
      id: 4,
      name: 'Call of Duty Mobile',
      icon: 'rifle',
      color: '#FF6B35',
      totalPlayers: 1500,
    },
    {
      id: 5,
      name: 'Fortnite',
      icon: 'umbrella',
      color: '#9146FF',
      totalPlayers: 1800,
    },
  ];

  // Classement général fictif
  generalRankings: { [gameId: number]: Player[] } = {
    1: [
      // Valorant
      {
        id: 1,
        username: 'ShadowStrike_CM',
        avatar: null,
        points: 2850,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 1,
        previousRank: 2,
      },
      {
        id: 2,
        username: 'NightHawk_SN',
        avatar: null,
        points: 2720,
        country: 'Sénégal',
        countryFlag: '🇸🇳',
        rank: 2,
        previousRank: 1,
      },
      {
        id: 3,
        username: 'ThunderLion_GH',
        avatar: null,
        points: 2680,
        country: 'Ghana',
        countryFlag: '🇬🇭',
        rank: 3,
        previousRank: 4,
      },
      {
        id: 4,
        username: 'FireStorm_NG',
        avatar: null,
        points: 2650,
        country: 'Nigeria',
        countryFlag: '🇳🇬',
        rank: 4,
        previousRank: 3,
      },
      {
        id: 5,
        username: 'ProGamer_CM',
        avatar: null,
        points: 2620,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 5,
        previousRank: 6,
        isCurrentUser: true,
      },
      {
        id: 6,
        username: 'ElitePlayer_CI',
        avatar: null,
        points: 2580,
        country: "Côte d'Ivoire",
        countryFlag: '🇨🇮',
        rank: 6,
        previousRank: 5,
      },
      {
        id: 7,
        username: 'MasterGamer_KE',
        avatar: null,
        points: 2540,
        country: 'Kenya',
        countryFlag: '🇰🇪',
        rank: 7,
        previousRank: 8,
      },
      {
        id: 8,
        username: 'Champion_ZA',
        avatar: null,
        points: 2500,
        country: 'Afrique du Sud',
        countryFlag: '🇿🇦',
        rank: 8,
        previousRank: 7,
      },
    ],
    2: [
      // FIFA 24
      {
        id: 9,
        username: 'FootballKing_NG',
        avatar: null,
        points: 3200,
        country: 'Nigeria',
        countryFlag: '🇳🇬',
        rank: 1,
        previousRank: 1,
      },
      {
        id: 10,
        username: 'SoccerLegend_GH',
        avatar: null,
        points: 3150,
        country: 'Ghana',
        countryFlag: '🇬🇭',
        rank: 2,
        previousRank: 3,
      },
      {
        id: 5,
        username: 'ProGamer_CM',
        avatar: null,
        points: 3100,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 3,
        previousRank: 2,
        isCurrentUser: true,
      },
      {
        id: 11,
        username: 'GoalMaster_SN',
        avatar: null,
        points: 3050,
        country: 'Sénégal',
        countryFlag: '🇸🇳',
        rank: 4,
        previousRank: 5,
      },
      {
        id: 12,
        username: 'FieldAce_MA',
        avatar: null,
        points: 3000,
        country: 'Maroc',
        countryFlag: '🇲🇦',
        rank: 5,
        previousRank: 4,
      },
    ],
  };

  // Classement par pays (Cameroun)
  countryRankings: { [gameId: number]: Player[] } = {
    1: [
      // Valorant - Cameroun
      {
        id: 1,
        username: 'ShadowStrike_CM',
        avatar: null,
        points: 2850,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 1,
        previousRank: 2,
      },
      {
        id: 5,
        username: 'ProGamer_CM',
        avatar: null,
        points: 2620,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 2,
        previousRank: 3,
        isCurrentUser: true,
      },
      {
        id: 13,
        username: 'CameroonPro_YDE',
        avatar: null,
        points: 2450,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 3,
        previousRank: 1,
      },
      {
        id: 14,
        username: 'LionIndomitable',
        avatar: null,
        points: 2380,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 4,
        previousRank: 4,
      },
      {
        id: 15,
        username: 'EsportCM_DLA',
        avatar: null,
        points: 2320,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 5,
        previousRank: 6,
      },
    ],
    2: [
      // FIFA 24 - Cameroun
      {
        id: 5,
        username: 'ProGamer_CM',
        avatar: null,
        points: 3100,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 1,
        previousRank: 2,
        isCurrentUser: true,
      },
      {
        id: 16,
        username: 'CameroonLegend',
        avatar: null,
        points: 2950,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 2,
        previousRank: 1,
      },
      {
        id: 17,
        username: 'IndomitableLion',
        avatar: null,
        points: 2880,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 3,
        previousRank: 3,
      },
      {
        id: 18,
        username: 'FootballCM_237',
        avatar: null,
        points: 2820,
        country: 'Cameroun',
        countryFlag: '🇨🇲',
        rank: 4,
        previousRank: 5,
      },
    ],
  };

  constructor() {}

  ngOnInit() {
    // Sélectionner le premier jeu par défaut
    this.selectedGame = this.games[0];
  }

  selectGame(game: Game) {
    this.selectedGame = game;
  }

  selectGameById(gameId: number) {
    const game = this.games.find((g) => g.id === gameId);
    if (game) {
      this.selectGame(game);
    }
  }

  selectRankingType(type: 'general' | 'country') {
    this.selectedRankingType = type;
  }

  getCurrentRankings(): Player[] {
    if (!this.selectedGame) return [];

    if (this.selectedRankingType === 'general') {
      return this.generalRankings[this.selectedGame.id] || [];
    } else {
      return this.countryRankings[this.selectedGame.id] || [];
    }
  }

  getRankChange(player: Player): 'up' | 'down' | 'same' {
    if (!player.previousRank) return 'same';
    if (player.rank < player.previousRank) return 'up';
    if (player.rank > player.previousRank) return 'down';
    return 'same';
  }

  getRankChangeIcon(player: Player): string {
    const change = this.getRankChange(player);
    switch (change) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  }

  getRankChangeColor(player: Player): string {
    const change = this.getRankChange(player);
    switch (change) {
      case 'up':
        return 'success';
      case 'down':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
