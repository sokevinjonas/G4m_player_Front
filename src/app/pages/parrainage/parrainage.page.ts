import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.page.html',
  styleUrls: ['./parrainage.page.scss'],
  standalone: false,
})
export class ParrainagePage implements OnInit {
  user: any = {};
  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
  }

  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.user?.referral_code,
    });
    console.log(
      'Code de parrainage copié dans le presse-papiers:',
      this.user?.referral_code
    );

    // Afficher le toast de confirmation
    const toast = await this.toastController.create({
      message: 'Code de parrainage copié avec succès !',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle',
    });
    toast.present();
  };
}
