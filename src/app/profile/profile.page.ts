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
  this.router.navigate(['/edit-profile']);
}

goToReferral() {
  this.router.navigate(['/referral']);
}

goToHistory() {
  this.router.navigate(['/my-history']);
}

goToRanking() {
  this.router.navigate(['/ranking']);
}

goToNotifications() {
  this.router.navigate(['/settings/notifications']);
}

openPrivacyPolicy() {
  this.router.navigate(['/privacy-policy']);
}

openUserGuide() {
  this.router.navigate(['/user-guide']);
}

goToSupport() {
  this.router.navigate(['/support']);
}

logout() {
  // this.authService.logout();
}

}
