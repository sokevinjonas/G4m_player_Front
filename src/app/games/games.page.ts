import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit, OnDestroy {
  games: any[] = [];
  filteredGames: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Tous';
  isLoading: boolean = true;
  showNoGamesMessage: boolean = false;
  private loadingTimeout: any;

  constructor(private apiService: ApiService) {}

  ionViewWillEnter() {
    console.log('GamesPage: ionViewWillEnter');
    this.isLoading = true;
    this.showNoGamesMessage = false;

    // Timeout de 2 secondes pour afficher le message d'erreur
    this.loadingTimeout = setTimeout(() => {
      if (this.games.length === 0) {
        this.isLoading = false;
        this.showNoGamesMessage = true;
      }
    }, 2000);

    this.apiService.getGames().subscribe({
      next: (data) => {
        clearTimeout(this.loadingTimeout);
        this.games = data;
        this.filteredGames = data;
        this.isLoading = false;
        this.showNoGamesMessage = this.games.length === 0;
        // Extraire les catégories uniques
        const cats = data
          .map((g: any) => g.type_game?.name)
          .filter((c: string | undefined) => !!c);
        this.categories = ['Tous', ...Array.from(new Set<string>(cats))];
        console.log(this.games);
      },
      error: (error) => {
        clearTimeout(this.loadingTimeout);
        this.isLoading = false;
        this.showNoGamesMessage = true;
        console.error('Erreur lors du chargement des jeux:', error);
      },
    });
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }

  ngOnDestroy() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  selectCategory(category: string | undefined) {
    if (!category) return;
    this.selectedCategory = category;
    if (category === 'Tous') {
      this.filteredGames = this.games;
    } else {
      this.filteredGames = this.games.filter(
        (g) => g.type_game?.name === category
      );
    }
  }
}
