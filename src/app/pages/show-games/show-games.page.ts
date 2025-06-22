import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';

@Component({
  selector: 'app-show-games',
  templateUrl: './show-games.page.html',
  styleUrls: ['./show-games.page.scss'],
  standalone: false,
})
export class ShowGamesPage implements OnInit {
  game: any = null;
  loading = true;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

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
}
