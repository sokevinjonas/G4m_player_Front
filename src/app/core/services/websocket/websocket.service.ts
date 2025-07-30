import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../../environments/environment';

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

  // Liste des clusters à tester (en commençant par mt1 qui est configuré dans votre backend)
  private clusters: string[] = [
    'eu',
    'us2',
    'us3',
    'ap1',
    'ap2',
    'ap3',
    'ap4',
    environment.pusher.cluster,
  ];
  private currentClusterIndex: number = 0;
  private silentMode: boolean = true; // Mode silencieux pour éviter les logs d'erreur

  constructor() {
    this.initializeEcho();
  }

  private initializeEcho() {
    try {
      // Configuration Pusher
      window.Pusher = Pusher;

      const currentCluster = this.clusters[this.currentClusterIndex];
      if (!this.silentMode) {
        console.log(
          `🔧 Tentative de connexion avec le cluster: ${currentCluster}`
        );
      }

      this.echo = new Echo({
        broadcaster: 'pusher',
        key: environment.pusher.key,
        cluster: currentCluster,
        forceTLS: environment.pusher.forceTLS,
        encrypted: environment.pusher.encrypted,
        enabledTransports: ['ws', 'wss'],
        // Options additionnelles pour la stabilité
        auth: {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
        // Configuration spécifique pour résoudre les erreurs 1006
        disableStats: true,
        enableLogging: !environment.production,
        activityTimeout: 30000,
        pongTimeout: 6000,
        unavailableTimeout: 10000,
      });

      // Écouter les événements de connexion
      this.echo.connector.pusher.connection.bind('connected', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.silentMode = false; // Désactiver le mode silencieux une fois connecté
        console.log(
          `✅ WebSocket connecté avec succès sur le cluster: ${currentCluster}`
        );
      });

      this.echo.connector.pusher.connection.bind('connecting', () => {
        console.log(
          `🔄 Connexion en cours sur le cluster: ${currentCluster}...`
        );
      });

      this.echo.connector.pusher.connection.bind('unavailable', () => {
        console.warn(
          `⚠️ Service indisponible sur le cluster: ${currentCluster}`
        );
        this.isConnected = false;
        this.tryNextCluster();
      });

      this.echo.connector.pusher.connection.bind('failed', () => {
        console.error(
          `❌ Échec de connexion sur le cluster: ${currentCluster}`
        );
        this.isConnected = false;
        this.tryNextCluster();
      });

      this.echo.connector.pusher.connection.bind('disconnected', () => {
        this.isConnected = false;
        console.log('⚠️ WebSocket déconnecté');
        this.attemptReconnect();
      });

      this.echo.connector.pusher.connection.bind('error', (error: any) => {
        if (!this.silentMode) {
          console.error('❌ Erreur WebSocket détaillée:', {
            error,
            cluster: currentCluster,
            type: error.type,
            code: error.data?.code || error.error?.data?.code,
            message: error.data?.message || error.error?.data?.message,
            state: this.echo?.connector?.pusher?.connection?.state,
          });
        }
        this.isConnected = false;

        // Toujours essayer le cluster suivant en cas d'erreur
        this.tryNextCluster();
      });

      // Timeout de connexion
      setTimeout(() => {
        if (!this.isConnected) {
          this.tryNextCluster();
        }
      }, 10000); // 10 secondes de timeout
    } catch (error) {
      if (!this.silentMode) {
        console.error('❌ Erreur de connexion WebSocket:', error);
      }
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

      // Déconnecter l'ancienne connexion
      if (this.echo) {
        this.echo.disconnect();
      }

      setTimeout(() => {
        this.initializeEcho();
      }, 1000);
    } else {
      // Tous les clusters ont été testés, on reste silencieux
      this.isConnected = false;
    }
  }

  /**
   * Écouter les nouvelles inscriptions sur le dashboard admin
   */
  listenToAdminDashboard(callback: (data: any) => void) {
    if (!this.isWebSocketConnected()) {
      return null; // Pas de warning si WebSocket non connecté
    }

    try {
      console.log('🎧 Écoute du canal admin-dashboard...');
      return this.echo
        .channel('admin-dashboard')
        .listen('NewParticipant', (data: any) => {
          console.log(
            '📡 Nouvelle inscription reçue sur admin-dashboard:',
            data
          );
          callback(data);
        });
    } catch (error) {
      console.error("❌ Erreur lors de l'écoute admin-dashboard:", error);
      return null;
    }
  }

  /**
   * Écouter les mises à jour d'une compétition spécifique
   */
  listenToCompetition(competitionId: number, callback: (data: any) => void) {
    if (!this.isWebSocketConnected()) {
      return null; // Pas de warning si WebSocket non connecté
    }

    try {
      const channelName = `competitions.${competitionId}`;
      console.log(`🎧 Écoute du canal ${channelName}...`);

      return this.echo
        .channel(channelName)
        .listen('NewParticipant', (data: any) => {
          console.log(`📡 Mise à jour compétition ${competitionId}:`, data);
          callback(data);
        });
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'écoute competition ${competitionId}:`,
        error
      );
      return null;
    }
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
   * Diagnostic de la connexion WebSocket
   */
  getDiagnosticInfo() {
    const status = this.getConnectionStatus();

    console.log('🔍 Diagnostic WebSocket:', {
      isConnected: this.isConnected,
      echoExists: !!this.echo,
      pusherState: this.echo?.connector?.pusher?.connection?.state,
      currentCluster: status.currentCluster,
      attempts: status.attempts,
      availableClusters: status.availableClusters,
    });

    return status;
  }

  /**
   * Tester la connexion avec un cluster spécifique
   */
  testCluster(clusterName: string) {
    console.log(`🧪 Test du cluster: ${clusterName}`);

    const testIndex = this.clusters.indexOf(clusterName);
    if (testIndex !== -1) {
      this.currentClusterIndex = testIndex;
      this.reconnectAttempts = 0;
      this.disconnect();
      this.initializeEcho();
    } else {
      console.error(`❌ Cluster ${clusterName} non trouvé dans la liste`);
    }
  }

  /**
   * Test de connectivité Pusher simple
   */
  async testPusherConnectivity() {
    console.log('🧪 Test de connectivité Pusher...');

    try {
      // Test avec Pusher direct (sans Echo)
      const testPusher = new Pusher(environment.pusher.key, {
        cluster: environment.pusher.cluster,
        forceTLS: environment.pusher.forceTLS,
      });

      testPusher.connection.bind('connected', () => {
        console.log('✅ Test Pusher direct réussi !');
        testPusher.disconnect();
      });

      testPusher.connection.bind('error', (error: any) => {
        console.error('❌ Échec test Pusher direct:', error);
        testPusher.disconnect();
      });

      // Timeout pour le test
      setTimeout(() => {
        if (testPusher.connection.state !== 'connected') {
          console.error('⏱️ Timeout du test Pusher');
          testPusher.disconnect();
        }
      }, 10000);
    } catch (error) {
      console.error('❌ Erreur lors du test Pusher:', error);
    }
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

  /**
   * Mode fallback : polling manuel au lieu de WebSocket
   */
  enablePollingMode() {
    console.log('🔄 Activation du mode polling (fallback sans WebSocket)');
    this.disconnect();

    // Émettre un événement pour que les composants passent en mode polling
    window.dispatchEvent(
      new CustomEvent('websocket-fallback', {
        detail: { mode: 'polling' },
      })
    );
  }

  /**
   * Vérifier si le mode fallback est activé
   */
  isPollingMode(): boolean {
    return (
      !this.isConnected && this.currentClusterIndex >= this.clusters.length
    );
  }
}
