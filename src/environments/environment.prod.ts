export const environment = {
  production: true,
  apiUrl: 'https://backend.g4meproafrica.com/api',

  // Configuration WebSocket/Pusher
  pusher: {
    key: 'e777009ba8f8055d774d',
    cluster: 'mt1', // Cluster principal de votre backend
    forceTLS: true,
    encrypted: true,
  },
};
