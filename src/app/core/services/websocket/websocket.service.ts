import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private echo: any;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;

  // Liste des clusters à tester
  private clusters: string[] = ['eu', 'us2', 'us3', 'ap1', 'ap2', 'ap3', 'ap4'];
  private currentClusterIndex: number = 0;

  constructor() {
    this.initializeEcho();
  }

  private initializeEcho() {
    try {
      // Configuration Pusher
      window.Pusher = Pusher;

      const currentCluster = this.clusters[this.currentClusterIndex];
      console.log(
        `🔧 Tentative de connexion avec le cluster: ${currentCluster}`
      );

      this.echo = new Echo({
        broadcaster: 'pusher',
        key: 'e777009ba8f8055d774d', // Votre clé Pusher
        cluster: currentCluster,
        forceTLS: true,
        encrypted: true,
        enabledTransports: ['ws', 'wss'],
        // Options additionnelles pour la stabilité
        auth: {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      });

      // Écouter les événements de connexion
      this.echo.connector.pusher.connection.bind('connected', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log(
          `✅ WebSocket connecté avec succès sur le cluster: ${currentCluster}`
        );
      });

      this.echo.connector.pusher.connection.bind('disconnected', () => {
        this.isConnected = false;
        console.log('⚠️ WebSocket déconnecté');
        this.attemptReconnect();
      });

      this.echo.connector.pusher.connection.bind('error', (error: any) => {
        console.error('❌ Erreur WebSocket:', error);
        this.isConnected = false;

        // Si c'est une erreur de cluster, essayer le suivant
        if (error.error?.data?.code === 4001) {
          this.tryNextCluster();
        } else {
          this.attemptReconnect();
        }
      });

      // Timeout de connexion
      setTimeout(() => {
        if (!this.isConnected) {
          console.warn(
            `⏱️ Timeout de connexion pour le cluster ${currentCluster}`
          );
          this.tryNextCluster();
        }
      }, 10000); // 10 secondes de timeout
    } catch (error) {
      console.error('❌ Erreur de connexion WebSocket:', error);
      this.isConnected = false;
      this.tryNextCluster();
    }
  }

  /**
   * Tentative de reconnexion automatique
   */
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`
      );

      setTimeout(() => {
        this.initializeEcho();
      }, this.reconnectDelay);
    } else {
      console.error('❌ Échec de reconnexion après plusieurs tentatives');
      // Essayer le cluster suivant après plusieurs échecs
      this.tryNextCluster();
    }
  }

  /**
   * Essayer le cluster suivant
   */
  private tryNextCluster() {
    if (this.currentClusterIndex < this.clusters.length - 1) {
      this.currentClusterIndex++;
      this.reconnectAttempts = 0;
      console.log(
        `🔄 Essai du cluster suivant: ${
          this.clusters[this.currentClusterIndex]
        }`
      );

      // Déconnecter l'ancienne connexion
      if (this.echo) {
        this.echo.disconnect();
      }

      setTimeout(() => {
        this.initializeEcho();
      }, 1000);
    } else {
      console.error('❌ Tous les clusters ont été testés sans succès');
      this.isConnected = false;
    }
  }

  /**
   * Écouter les nouvelles inscriptions sur le dashboard admin
   */
  listenToAdminDashboard(callback: (data: any) => void) {
    if (!this.isConnected) {
      console.warn('WebSocket non connecté');
      return null;
    }

    return this.echo
      .channel('admin-dashboard')
      .listen('NewParticipant', (data: any) => {
        console.log('📡 Nouvelle inscription reçue:', data);
        callback(data);
      });
  }

  /**
   * Écouter les mises à jour d'une compétition spécifique
   */
  listenToCompetition(competitionId: number, callback: (data: any) => void) {
    if (!this.isConnected) {
      console.warn('WebSocket non connecté');
      return null;
    }

    return this.echo
      .channel(`competitions.${competitionId}`)
      .listen('NewParticipant', (data: any) => {
        console.log(`📡 Mise à jour compétition ${competitionId}:`, data);
        callback(data);
      });
  }

  /**
   * Arrêter d'écouter un canal
   */
  stopListening(channelName: string) {
    if (this.echo) {
      this.echo.leaveChannel(channelName);
    }
  }

  /**
   * Vérifier le statut de connexion
   */
  isWebSocketConnected(): boolean {
    return (
      this.isConnected &&
      this.echo &&
      this.echo.connector.pusher.connection.state === 'connected'
    );
  }

  /**
   * Obtenir le statut détaillé de la connexion
   */
  getConnectionStatus(): {
    connected: boolean;
    state: string;
    attempts: number;
    currentCluster: string;
    availableClusters: string[];
  } {
    return {
      connected: this.isConnected,
      state: this.echo?.connector?.pusher?.connection?.state || 'unknown',
      attempts: this.reconnectAttempts,
      currentCluster: this.clusters[this.currentClusterIndex],
      availableClusters: this.clusters,
    };
  }

  /**
   * Forcer une reconnexion
   */
  forceReconnect() {
    this.reconnectAttempts = 0;
    this.disconnect();
    this.initializeEcho();
  }

  /**
   * Réinitialiser et essayer tous les clusters depuis le début
   */
  resetAndRetryAllClusters() {
    this.currentClusterIndex = 0;
    this.reconnectAttempts = 0;
    this.disconnect();
    this.initializeEcho();
  }

  /**
   * Déconnecter le WebSocket
   */
  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.isConnected = false;
    }
  }
}
