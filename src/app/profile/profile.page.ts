import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any;

  constructor() {}

  ngOnInit() {
    this.user = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  }
}
