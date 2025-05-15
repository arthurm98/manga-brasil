import axios from 'axios';

const MAL_API_URL = 'https://api.myanimelist.net/v2/manga';
const CLIENT_ID = import.meta.env.VITE_MAL_CLIENT_ID;

export async function searchMALManga(query: string) {
  const response = await axios.get(MAL_API_URL, {
    params: { q: query, limit: 10 },
    headers: { 'X-MAL-CLIENT-ID': CLIENT_ID },
  });
  return response.data.data;
}
