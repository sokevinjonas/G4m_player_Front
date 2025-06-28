import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/core/services/api/api.service';
@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.page.html',
  styleUrls: ['./parrainage.page.scss'],
  standalone: false,
})
export class ParrainagePage implements OnInit {
  user: any = {};
  filleuls: any[] = [];
  nbrFilleuls: number = 0;

  constructor(
    private toastController: ToastController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', this.user);
    this.loadFilleuls();
  }

  loadFilleuls() {
    this.apiService.getFilleuls().subscribe(
      (response) => {
        this.filleuls = response.filleuls || [];
        this.nbrFilleuls = response.count || 0;
        console.log('Filleuls:', this.filleuls, 'Count:', this.nbrFilleuls);
      },
      (error) => {
        console.error('Erreur lors du chargement des filleuls:', error);
      }
    );
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
    const message = `🎮 Rejoins-moi sur G4M Player avec mon code de parrainage: ${this.user?.referral_code}

🎁 Tu gagnes des points bonus à l'inscription !
📱 Télécharge l'app maintenant et utilise mon code pour commencer ton aventure gaming !

#G4MPlayer #Gaming #ParrainageJeu`;

    try {
      await Share.share({
        title: 'Rejoins G4M Player !',
        text: message,
        // Remplacez par l'une de ces options selon votre cas :
        // url: 'https://play.google.com/store/apps/details?id=com.g4me.proafrica', // Si publié sur Play Store
        // url: 'https://apps.apple.com/app/id123456789', // Si publié sur App Store
        // url: 'https://votre-site-web.com', // Si vous avez un site web
        url: 'https://g4meproafrica.com', // Remplacez par votre URL réelle
        dialogTitle: 'Partager avec des amis',
      });
    } catch (error: any) {
      console.log('Partage annulé ou erreur:', error);

      // Fallback: copier le message dans le presse-papiers si l'API Share n'est pas disponible
      if (error?.message && error.message.includes('Share API not available')) {
        try {
          await Clipboard.write({
            string: message,
          });

          const toast = await this.toastController.create({
            message:
              "📋 Message d'invitation copié ! Partagez-le avec vos amis.",
            duration: 3000,
            position: 'bottom',
            color: 'primary',
            icon: 'copy',
          });
          toast.present();
        } catch (clipboardError) {
          console.error('Erreur lors de la copie:', clipboardError);
          const errorToast = await this.toastController.create({
            message: '❌ Impossible de partager ou copier le message',
            duration: 2000,
            position: 'bottom',
            color: 'danger',
          });
          errorToast.present();
        }
      }
    }
  };

  // Méthodes pour rediriger vers les réseaux sociaux
  ouvrirFacebook = async () => {
    const url = 'https://www.facebook.com/g4meproafrica'; // Remplacez par votre page Facebook
    await this.ouvrirLien(url, 'Facebook');
  };

  ouvrirTikTok = async () => {
    const url = 'https://www.tiktok.com/@g4meproafrica'; // Remplacez par votre compte TikTok
    await this.ouvrirLien(url, 'TikTok');
  };

  ouvrirInstagram = async () => {
    const url = 'https://www.instagram.com/g4meproafrica'; // Remplacez par votre compte Instagram
    await this.ouvrirLien(url, 'Instagram');
  };

  private ouvrirLien = async (url: string, plateforme: string) => {
    try {
      // Ouvrir le lien dans le navigateur/app
      window.open(url, '_blank');

      // Toast de confirmation avec points bonus
      const toast = await this.toastController.create({
        message: `🎉 +5 points pour avoir visité ${plateforme} !`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
        icon: 'trophy',
      });
      toast.present();
    } catch (error) {
      console.error(`Erreur lors de l'ouverture de ${plateforme}:`, error);
      const errorToast = await this.toastController.create({
        message: `❌ Impossible d'ouvrir ${plateforme}`,
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      errorToast.present();
    }
  };
}
