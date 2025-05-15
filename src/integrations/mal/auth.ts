// Fluxo OAuth2 para MyAnimeList
// (implementação inicial, pode ser expandida para login do usuário)

const CLIENT_ID = import.meta.env.VITE_MAL_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/auth/mal/callback';

export function getMALAuthUrl() {
  const url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  return url;
}
