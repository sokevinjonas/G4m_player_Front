import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
  standalone: false,
})
export class BadgesPage implements OnInit {
  unlockedBadges: any[] = [];
  lockedBadges: any[] = [];
  userId = 120; // Remplace par l'ID réel de l'utilisateur connecté

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    console.log('BadgesPage: ionViewWillEnter');
    this.api.getUserBadgesUnLocked(this.userId).subscribe((badges) => {
      this.unlockedBadges = badges.badges || [];
      console.log('Badges débloqués:', this.unlockedBadges);
    });
    this.api.getUserBadgesLocked(this.userId).subscribe((badges) => {
      this.lockedBadges = badges.badges || [];
      console.log('Badges verrouillés:', this.lockedBadges);
    });
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }
}
