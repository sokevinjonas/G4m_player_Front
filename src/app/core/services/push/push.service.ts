import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

export const FCM_TOKEN = 'push_notification_token';
@Injectable({
  providedIn: 'root',
})
export class PushService {
  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private storage: StorageService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
      // this.getDeliveredNotifications();
    }
  }

  private async registerPush() {
    try {
      // Demander la permission en premier
      let permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive === 'granted') {
        // Si la permission est accordée, enregistrer l'appareil
        await PushNotifications.register();
      } else {
        // Si refusé, informer l'utilisateur
        this.showPermissionAlert();
        throw new Error('User denied permissions!');
      }

      // Ajouter les listeners après avoir géré les permissions
      this.addListeners();
    } catch (e) {
      console.log('Error during push registration:', e);
    }
  }

  async getDeliveredNotifications() {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  addListeners() {
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('My token: ', token.value);
      const fcm_token = token.value;
      let go = 1;
      try {
        const saved_token = JSON.parse(
          (await this.storage.getStorage(FCM_TOKEN))?.value
        );
        if (saved_token) {
          if (fcm_token === saved_token) {
            console.log('same token');
            go = 0;
          } else {
            go = 2;
          }
        }
        if (go === 1) {
          // save token
          this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
        } else if (go === 2) {
          // update token
          const data = {
            expired_token: saved_token,
            refreshed_token: fcm_token,
          };
          this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
        }
      } catch (error) {
        // Gérer le cas où le token n'existe pas encore
        this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log(
          'Action performed: ' + JSON.stringify(notification.notification)
        );
        console.log('push data: ', data);
        if (data?.redirect) {
          this.router.navigateByUrl(data.redirect);
        }
      }
    );
  }

  async removeFcmToken() {
    try {
      const saved_token = JSON.parse(
        (await this.storage.getStorage(FCM_TOKEN)).value
      );
      this.storage.removeStorage(FCM_TOKEN);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }

  private async showPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Permission requise',
      message:
        'Pour recevoir des alertes de match et des mises à jour, veuillez autoriser les notifications dans les paramètres de votre téléphone.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ouvrir les paramètres',
          handler: () => {
            // Ouvre les paramètres de l'application pour cette application spécifique
            // Note: Cette fonctionnalité dépend du support de la plateforme.
            // Pour Capacitor, il n'y a pas de méthode directe, mais on peut guider l'utilisateur.
            // Sur les versions plus récentes, cela pourrait ouvrir les paramètres de l'app.
            // openSettings() est une fonctionnalité que vous pourriez avoir à implémenter nativement si nécessaire.
            // Pour l'instant, on informe l'utilisateur.
            this.showToast(
              "Veuillez activer les notifications dans les paramètres de l'application.",
              'primary'
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
