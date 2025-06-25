import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.user = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  }
  editProfile() {
    this.router.navigate(['/modifier-mon-profil']);
  }

  goToReferral() {
    this.router.navigate(['/parrainage']);
  }

  goToHistory() {
    this.router.navigate(['/historique']);
  }

  goToRanking() {
    this.router.navigate(['/classement']);
  }

  goToNotifications() {
    this.router.navigate(['/notification']);
  }

  openPrivacyPolicy() {
    this.router.navigate(['/politique']);
  }

  openUserGuide() {
    this.router.navigate(['/guide']);
  }

  goToSupport() {
    this.router.navigate(['/aides']);
  }

  logout() {
    // this.authService.logout();
  }
}
