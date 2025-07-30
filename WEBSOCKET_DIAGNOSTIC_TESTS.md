# 🔧 Tests de diagnostic WebSocket - Erreur 1006

## 🧪 Tests à effectuer dans la console du navigateur

### 1. Vérification de l'état actuel

```javascript
// Ouvrir la console (F12) et taper :
console.log("🔍 État WebSocket:", websocketService.getConnectionStatus());
```

### 2. Test de connectivité Pusher directe

```javascript
// Tester la connexion Pusher sans Echo
websocketService.testPusherConnectivity();
```

### 3. Test de clusters individuels

```javascript
// Tester différents clusters un par un
websocketService.testCluster("mt1"); // Votre cluster principal
websocketService.testCluster("eu"); // Cluster européen
websocketService.testCluster("us2"); // Cluster US
```

### 4. Diagnostic complet

```javascript
// Information complète sur la configuration
websocketService.getDiagnosticInfo();
```

## 📋 Résultats attendus

### ✅ Connexion réussie

Vous devriez voir dans la console :

```
🔧 Tentative de connexion avec le cluster: mt1
✅ WebSocket connecté avec succès sur le cluster: mt1
```

### ❌ Erreur 1006 persistante

Si l'erreur persiste, vous verrez :

```
❌ Erreur WebSocket détaillée: {
  cluster: "mt1",
  type: "PusherError",
  code: 1006,
  message: undefined
}
🔄 Problème de connexion WebSocket (code 1006) sur mt1, essai cluster suivant...
```

## 🔧 Causes possibles de l'erreur 1006

### 1. **Problème réseau**

- Pare-feu bloquant les WebSockets
- Proxy d'entreprise
- Restriction réseau

### 2. **Configuration Pusher**

- Clé invalide ou expirée
- Cluster incorrect
- Limite de connexions atteinte

### 3. **Problème SSL/TLS**

- Certificats non valides
- Problème de chiffrement

### 4. **Problème navigateur**

- WebSockets désactivés
- Extensions bloquantes
- Cache navigateur

## 🛠️ Solutions à tester

### Test 1: Vérifier les WebSockets du navigateur

```javascript
// Dans la console, tester si les WebSockets fonctionnent
const testWS = new WebSocket("wss://echo.websocket.org");
testWS.onopen = () => console.log("✅ WebSockets navigateur OK");
testWS.onerror = (error) => console.log("❌ WebSockets navigateur KO:", error);
```

### Test 2: Tester Pusher avec une clé publique

```javascript
// Test avec la clé de test publique de Pusher
const testPusher = new Pusher("app-key", {
  cluster: "mt1",
  forceTLS: true,
});
testPusher.connection.bind("connected", () => {
  console.log("✅ Pusher test public OK");
  testPusher.disconnect();
});
```

### Test 3: Désactiver temporairement HTTPS

Dans `websocket.service.ts`, essayer temporairement :

```typescript
forceTLS: false,  // Au lieu de true
```

## 📞 Prochaines étapes selon les résultats

### Si WebSockets navigateur KO

- Problème réseau/pare-feu
- Tester sur un autre réseau
- Tester avec un VPN

### Si WebSockets OK mais Pusher KO

- Problème de configuration Pusher
- Vérifier la clé et le cluster
- Contacter le support Pusher

### Si tout échoue

- Utiliser le mode polling fallback
- Interroger l'API toutes les 30 secondes
- Désactiver les fonctionnalités temps réel

## 🎯 Mode fallback automatique

Si tous les clusters échouent, l'application active automatiquement :

- Mode polling (requêtes API périodiques)
- Mise à jour manuelle
- Notifications différées

Vous verrez dans la console :

```
❌ Tous les clusters ont été testés sans succès
🔄 Activation du mode fallback (polling)
```
