import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.page.html',
  styleUrls: ['./parrainage.page.scss'],
  standalone: false,
})
export class ParrainagePage implements OnInit {
  user: any = {};
  filleuls: any[] = [];

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
    this.loadFilleuls();
  }

  loadFilleuls() {
    // Simulation de données de filleuls - remplacer par un appel API réel
    this.filleuls = [
      {
        id: 1,
        nom: 'Jean Dupont',
        email: 'jean@example.com',
        dateInscription: new Date('2024-01-15'),
        points: 50,
      },
      {
        id: 2,
        nom: 'Marie Martin',
        email: 'marie@example.com',
        dateInscription: new Date('2024-02-20'),
        points: 30,
      },
      {
        id: 3,
        nom: 'Pierre Durand',
        email: 'pierre@example.com',
        dateInscription: new Date('2024-03-10'),
        points: 75,
      },
    ];
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

  inviterAmi = async () => {
    await Share.share({
      title: 'Invitez vos amis à rejoindre G4ME Pro Africa',
      text: `Utilisez mon code de parrainage : ${this.user?.referral_code}`,
      url: 'http://ionicframework.com/',
      dialogTitle: 'Partager avec des amis',
    });
  };
}
