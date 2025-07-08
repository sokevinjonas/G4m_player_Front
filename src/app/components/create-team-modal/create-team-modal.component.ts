import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserResponse } from 'src/app/core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

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
  searchResults: UserResponse[] = [];
  invitedMembers: UserResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private authService: AuthenticationService
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
      this.authService.searchUsers(query).subscribe((users) => {
        this.searchResults = users;
      });
    }
  }

  inviteUser(user: UserResponse) {
    if (
      !this.invitedMembers.find((member) => member.user.id === user.user.id)
    ) {
      this.invitedMembers.push(user);
    }
    this.searchResults = [];
  }

  removeInvitedUser(user: UserResponse) {
    this.invitedMembers = this.invitedMembers.filter(
      (member) => member.user.id !== user.user.id
    );
  }

  submitForm() {
    if (this.teamForm.valid) {
      const teamData = {
        name: this.teamForm.value.name,
        members: this.invitedMembers.map((member) => member.user.id),
      };
      this.modalController.dismiss({ teamData });
    }
  }
}
