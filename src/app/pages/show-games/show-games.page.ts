import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { FileSaveOrPreviewService } from 'src/app/core/services/fileSaveOrPreview/file-save-or-preview.service';

@Component({
  selector: 'app-show-games',
  templateUrl: './show-games.page.html',
  styleUrls: ['./show-games.page.scss'],
  standalone: false,
})
export class ShowGamesPage implements OnInit {
  game: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    protected fileSaveOrPreviewService: FileSaveOrPreviewService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getGame(+id).subscribe((data) => {
        this.game = data;
        // Parse contact_link si c'est une string
        if (typeof this.game.contact_link === 'string') {
          try {
            this.game.contact_link = JSON.parse(this.game.contact_link);
          } catch {
            this.game.contact_link = [];
          }
        }
        this.loading = false;
      });
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
