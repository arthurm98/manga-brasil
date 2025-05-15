import axios from 'axios';

const ANILIST_API_URL = 'https://graphql.anilist.co';

export async function searchAniListManga(query: string) {
  const response = await axios.post(ANILIST_API_URL, {
    query: `query ($search: String) {
      Media(search: $search, type: MANGA) {
        id
        title { romaji english native }
        coverImage { large }
        description
        genres
        averageScore
        chapters
        status
        siteUrl
      }
    }`,
    variables: { search: query },
  });
  return response.data.data.Media;
}
