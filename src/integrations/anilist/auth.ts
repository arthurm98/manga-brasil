// Fluxo OAuth2 para AniList
// (implementação inicial, pode ser expandida para login do usuário)

const CLIENT_ID = import.meta.env.VITE_ANILIST_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/auth/anilist/callback';

export function getAniListAuthUrl() {
  const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  return url;
}
