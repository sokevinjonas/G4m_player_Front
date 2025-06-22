import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit {
  games: any[] = [];
  filteredGames: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Tous';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getGames().subscribe((data) => {
      this.games = data;
      this.filteredGames = data;
      // Extraire les catégories uniques
      const cats = data
        .map((g: any) => g.type_game?.name)
        .filter((c: string | undefined) => !!c);
      this.categories = ['Tous', ...Array.from(new Set<string>(cats))];
      console.log(this.games);
    });
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
