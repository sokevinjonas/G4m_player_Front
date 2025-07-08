import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
  selector: 'app-create-team-modal',
  templateUrl: './create-team-modal.component.html',
  styleUrls: ['./create-team-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class CreateTeamModalComponent implements OnInit {
  @Input() competitionId!: string;
  teamForm: FormGroup;
  searchResults: User[] = [];
  invitedMembers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private apiService: ApiService
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  searchUsers(event: any) {
    const query = event.target.value;
    if (query.length > 2) {
      this.apiService.searchUsers(query).subscribe((users) => {
        this.searchResults = users;
        console.log('Search results:', this.searchResults);
      });
    }
  }

  inviteUser(user: User) {
    if (!this.invitedMembers.find((member) => member.id === user.id)) {
      this.invitedMembers.push(user);
    }
    this.searchResults = [];
  }

  removeInvitedUser(user: User) {
    this.invitedMembers = this.invitedMembers.filter(
      (member) => member.id !== user.id
    );
  }

  submitForm() {
    if (this.teamForm.valid) {
      const teamData = {
        name: this.teamForm.value.name,
        members: this.invitedMembers.map((member) => member.id),
      };
      this.modalController.dismiss({ teamData });
    }
  }
}
