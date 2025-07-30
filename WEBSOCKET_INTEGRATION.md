# 🔥 Intégration WebSocket - Mises à jour en temps réel

## 📋 Vue d'ensemble

Cette intégration WebSocket permet d'afficher les mises à jour en temps réel dans l'application des tournois avec des indicateurs visuels dynamiques.

## ⚡ Fonctionnalités implémentées

### 🎯 Indicateurs visuels temps réel

1. **Badge LIVE/HORS LIGNE** dans le header

   - 🟢 Badge vert "LIVE" avec effet de brillance quand connecté
   - 🔴 Badge rouge "HORS LIGNE" quand déconnecté
   - Affichage du cluster actuel au survol

2. **Animations des cartes de compétition**

   - Animation de surbrillance quand une compétition est mise à jour
   - Badge "MIS À JOUR" avec effet flash
   - Indicateur "SUIVI" pour les compétitions suivies

3. **Compteur de participants animé**

   - Animation bounce lors des mises à jour
   - Icône de tendance montante
   - Barre de progression colorée

4. **Boutons d'action interactifs**

   - Animation pulse pour les boutons actifs
   - Badges LIVE pour les compétitions en cours
   - États visuels selon le statut de connexion

5. **Notifications toast**

   - Toast de notification pour chaque mise à jour
   - Messages personnalisés selon le type d'événement
   - Bouton de fermeture

6. **Indicateur de statut en bas de page**
   - Affichage du cluster en cours
   - Compteur de tentatives de connexion
   - Bouton de reconnexion manuelle

## 🔧 Configuration WebSocket

### Clusters supportés

Le service teste automatiquement plusieurs clusters Pusher :

- `eu` (Europe)
- `us2`, `us3` (États-Unis)
- `ap1`, `ap2`, `ap3`, `ap4` (Asie-Pacifique)

### Reconnexion automatique

- 5 tentatives max par cluster
- Délai de 3 secondes entre les tentatives
- Test automatique du cluster suivant en cas d'échec
- Timeout de 10 secondes par tentative

## 🎨 Styles CSS inclus

### Animations

- `pulse-live` : Animation du badge LIVE
- `card-highlight` : Surbrillance des cartes mises à jour
- `flash-update` : Clignotement du badge "MIS À JOUR"
- `count-bounce` : Rebond du compteur de participants
- `buttonPulse` : Pulsation des boutons actifs
- `shine` : Effet de brillance
- `slideUp` : Glissement des notifications

### Classes CSS

- `.live-indicator` : Style des badges de statut
- `.card-updated` : Cartes récemment mises à jour
- `.updated-badge` : Badge de mise à jour
- `.count-updated` : Compteur mis à jour
- `.progress-updated` : Barre de progression animée
- `.button-pulse` : Boutons avec animation

## 📡 Événements WebSocket écoutés

1. **Canal admin-dashboard** : `NewParticipant`

   - Nouvelles inscriptions globales

2. **Canaux par compétition** : `competitions.{id}`
   - Mises à jour spécifiques par compétition

## 🛠️ Méthodes principales

### WebsocketService

- `listenToAdminDashboard()` : Écoute globale
- `listenToCompetition()` : Écoute par compétition
- `isWebSocketConnected()` : Vérification du statut
- `getConnectionStatus()` : Statut détaillé
- `forceReconnect()` : Reconnexion forcée
- `resetAndRetryAllClusters()` : Test de tous les clusters

### TournamentsPage

- `setupWebSocketListeners()` : Configuration des écouteurs
- `handleNewParticipant()` : Gestion des nouvelles inscriptions
- `handleCompetitionUpdate()` : Gestion des mises à jour
- `reconnectWebSocket()` : Reconnexion manuelle

## 🚀 Utilisation

1. **Chargement automatique** : Les WebSocket se connectent automatiquement au chargement de la page
2. **Mises à jour temps réel** : Les données sont mises à jour automatiquement sans rechargement
3. **Indicateurs visuels** : Tous les changements sont visuellement signalés
4. **Gestion d'erreurs** : Reconnexion automatique et test de clusters

## 🔍 Débogage

Vérifiez la console pour :

- `✅ WebSocket connecté avec succès sur le cluster: {cluster}`
- `📡 Nouvelle inscription reçue: {data}`
- `🔄 Mise à jour compétition {id}: {data}`
- `❌ Erreur WebSocket: {error}`

## 📱 Responsive

Tous les indicateurs sont adaptés aux mobiles avec :

- Tailles de police ajustées
- Animations optimisées
- Positionnement responsive
