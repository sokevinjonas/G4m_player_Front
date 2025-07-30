# 🔧 Guide de débogage WebSocket - Erreur 1006

## 🚨 Erreur rencontrée

```
{
    "type": "PusherError",
    "data": {
        "code": 1006
    }
}
```

## 🔍 Causes possibles de l'erreur 1006

1. **Problème de cluster** : Le cluster configuré ne correspond pas
2. **Problème de réseau** : Pare-feu ou proxy bloquant les WebSockets
3. **Configuration SSL/TLS** : Problème de certificats
4. **Limite de connexions** : Trop de connexions simultanées
5. **Timeout de connexion** : Connexion trop lente

## ✅ Solutions implémentées

### 1. Configuration corrigée

- ✅ Cluster `mt1` ajouté en premier (correspondant à votre backend)
- ✅ Configuration depuis `environment.ts`
- ✅ Options de timeout ajustées

### 2. Gestion d'erreurs améliorée

- ✅ Détection spécifique de l'erreur 1006
- ✅ Test automatique de plusieurs clusters
- ✅ Reconnexion intelligente

### 3. Diagnostic intégré

- ✅ Méthodes de debug
- ✅ Logging détaillé
- ✅ Statut de connexion en temps réel

## 🧪 Comment tester

### 1. Ouvrir la console du navigateur

```javascript
// Vérifier le statut
websocketService.getDiagnosticInfo();

// Tester un cluster spécifique
websocketService.testCluster("mt1");

// Forcer une reconnexion
websocketService.resetAndRetryAllClusters();
```

### 2. Vérifier les logs

Recherchez dans la console :

- `🔧 Tentative de connexion avec le cluster: mt1`
- `✅ WebSocket connecté avec succès sur le cluster: mt1`
- `❌ Erreur WebSocket:` (si problème)

### 3. Indicateurs visuels

- Badge LIVE/HORS LIGNE dans le header
- Message de statut en bas de page
- Informations de cluster au survol

## 🔧 Configuration backend correspondante

Votre `.env` Laravel :

```env
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=2029959
PUSHER_APP_KEY=e777009ba8f8055d774d
PUSHER_APP_SECRET=f36162044138bf36a828
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME="https"
PUSHER_APP_CLUSTER="mt1"
```

Configuration frontend correspondante dans `environment.ts` :

```typescript
pusher: {
  key: 'e777009ba8f8055d774d',
  cluster: 'mt1',
  forceTLS: true,
  encrypted: true
}
```

## 🚀 Prochaines étapes

1. **Tester la connexion** avec le cluster `mt1`
2. **Vérifier les logs** dans la console
3. **Tester les événements** : créer une nouvelle inscription
4. **Vérifier la réception** des événements WebSocket

## 🆘 Si le problème persiste

### Vérifications supplémentaires :

1. **Pare-feu/Proxy** : Vérifier que les WebSockets ne sont pas bloqués
2. **Réseau d'entreprise** : Tester sur un autre réseau
3. **Navigateur** : Tester sur un autre navigateur
4. **Console Pusher** : Vérifier les logs sur pusher.com
5. **Configuration Laravel** : Vérifier `config/broadcasting.php`

### Commandes de debug :

```javascript
// Dans la console du navigateur
websocketService.getDiagnosticInfo();
websocketService.testCluster("eu"); // Tester un autre cluster
```

### Logs à vérifier :

- `🔧 Tentative de connexion...`
- `✅ WebSocket connecté...`
- `📡 Nouvelle inscription reçue...`
- `❌ Erreur WebSocket...`
