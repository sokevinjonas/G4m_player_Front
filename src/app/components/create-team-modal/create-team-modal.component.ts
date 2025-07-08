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
import { Subject, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';

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
  searchResults$!: Observable<User[]>;
  private searchTerms = new Subject<string>();
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

  ngOnInit() {
    this.searchResults$ = this.searchTerms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length > 2) {
          return this.apiService.searchUsers(term).pipe(
            catchError(() => {
              return of([]); // Retourne un tableau vide en cas d'erreur
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  searchUsers(event: any) {
    this.searchTerms.next(event.target.value);
  }

  inviteUser(user: User) {
    if (!this.invitedMembers.find((member) => member.id === user.id)) {
      this.invitedMembers.push(user);
    }
    this.searchTerms.next(''); // Vide les résultats de recherche
  }

  removeInvitedUser(user: User) {
    this.invitedMembers = this.invitedMembers.filter(
      (member) => member.id !== user.id
    );
  }

  isFormSubmittable(): boolean {
    return this.teamForm.valid && this.invitedMembers.length > 0;
  }

  submitForm() {
    if (this.isFormSubmittable()) {
      const teamData = {
        name: this.teamForm.value.name,
        members: this.invitedMembers.map((member) => member.id),
      };
      this.modalController.dismiss({ teamData });
    }
  }
}
