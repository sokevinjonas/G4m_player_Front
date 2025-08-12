import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-avatar-selection-modal',
  templateUrl: './avatar-selection-modal.component.html',
  styleUrls: ['./avatar-selection-modal.component.scss'],
  standalone: false,
})
export class AvatarSelectionModalComponent {
  @Input() avatars: string[] = [];

  constructor(private modalController: ModalController) {}

  selectAvatar(avatar: string) {
    this.modalController.dismiss({
      type: 'predefined',
      avatar: avatar,
    });
  }

  openCamera() {
    this.modalController.dismiss({
      type: 'camera',
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
