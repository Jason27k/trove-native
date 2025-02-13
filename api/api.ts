import {
  CalendarQueryResponse,
  MediaDisplay,
  SearchQueryResponse,
} from "./model";

const animeIdQuery = `
query media($id: Int) {
  Media(id: $id, type:ANIME) {
    id
    idMal
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description(asHtml:false)
    season
    seasonYear
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    synonyms
    source(version: 3)
    isAdult
    isLocked
    meanScore
    averageScore
    popularity
    favourites
    isFavouriteBlocked
    hashtag
    countryOfOrigin
    isLicensed
    isFavourite
    isRecommendationBlocked
    isFavouriteBlocked
    isReviewBlocked
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    relations {
      edges {
        id
        relationType(version: 2)
        node {
          id
          idMal
          title {
            english
            native
            romaji
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
      }
    }
    characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id
        role
        name
        voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
        node {
          id
          name {
            userPreferred
          }
          image {
            large
          }
        }
      }
    }
    staffPreview: staff(perPage: 8, sort: [RELEVANCE, ID]) {
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
      }
    }
    studios {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
    reviewPreview: reviews(perPage: 2, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        summary
        rating
        ratingAmount
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    recommendations(perPage: 10, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        rating
        userRating
        mediaRecommendation {
          id
          title {
            romaji
            english
            native
          }
          idMal
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    externalLinks {
      id
      site
      url
      type
      language
      color
      icon
      notes
      isDisabled
    }
    streamingEpisodes {
      site
      title
      thumbnail
      url
    }
    trailer {
      id
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    tags {
      id
      name
      description
      rank
      isMediaSpoiler
      isGeneralSpoiler
      userId
    }
    mediaListEntry {
      id
      status
      score
    }
    stats {
      statusDistribution {
        status
        amount
      }
      scoreDistribution {
        score
        amount
      }
    }
  }
}
`;

export const fetchAniListAnime = async (id: number) => {
  const query = animeIdQuery;
  return await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
  });
};

const calendarQuery = `
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page(page: $page) {
    pageInfo {
      hasNextPage
      total
    }
    airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd) {
      id
      episode
      airingAt
      media {
        id
        idMal
        title {
          romaji
          native
          english
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        season
        seasonYear
        format
        genres
        duration
        popularity
        episodes
        type
        averageScore
        description(asHtml:false)
        isAdult
        bannerImage
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        coverImage {
          extraLarge
          color
        }
        rankings {
          rank
          type
          season
          allTime
        }
        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
      }
    }
  }
}
`;

export const fetchSchedule = async (
  startOfWeek: number,
  endOfWeek: number,
  page: number
) => {
  const query = calendarQuery;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { weekStart: startOfWeek, weekEnd: endOfWeek, page: page },
    }),
  });
  let json: CalendarQueryResponse = await response.json();
  const deduplicatedAnimes = Array.from(
    new Map(
      json.data.Page.airingSchedules.map((anime) => [anime.id, anime])
    ).values()
  );
  json.data.Page.airingSchedules = deduplicatedAnimes;
  return json;
};

const searchQuery = `
query ($page: Int = 1, $id: Int, $isAdult: Boolean = false, $search: String, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $year: String, $genres: [String], $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: ANIME, season: $season, format_in:[TV, ONA], status: $status, seasonYear: $seasonYear, startDate_like: $year, search: $search, genre_in: $genres, sort: $sort, isAdult: $isAdult) {
      id
      idMal
      title {
        romaji
        native
        english
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      status
      season
      seasonYear
      format
      genres
      duration
      popularity
      episodes
      type
      averageScore
      description(asHtml:false)
      isAdult
      bannerImage
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      coverImage {
        extraLarge
        color
      }
      rankings {
        rank
        type
        season
        allTime
      }
      studios(isMain: true) {
        nodes {
          id
          name
          siteUrl
        }
      }
    }
  }
}
`;

// $page: Int = 1, $id: Int, $isAdult: Boolean = false, $search: String, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $year: String, $genres: [String], $sort

export type SearchQueryVariables = {
  page?: number;
  id?: number;
  isAdult?: boolean;
  search?: string;
  status?: string;
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear?: number;
  year?: string;
  genres?: string[];
  sort?: string[];
};

export const fetchSearch = async (variables: SearchQueryVariables) => {
  const response = await animeSearch(variables);
  return response;
};

export async function animeSearch(
  variables: SearchQueryVariables,
  uniqueIds?: Number[]
) {
  if (variables.year) {
    variables.year = variables.year + "%";
  }
  const query = searchQuery;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  console.log(response.status);
  let json: SearchQueryResponse = await response.json();
  console.log(variables);

  const deduplicatedAnimes = Array.from(
    new Map(json.data.Page.media.map((anime) => [anime.id, anime])).values()
  );
  const uniqueSet = new Set(uniqueIds);
  if (uniqueIds) {
    json.data.Page.media = deduplicatedAnimes.filter(
      (anime) => !uniqueSet.has(anime.id)
    );
  } else {
    json.data.Page.media = deduplicatedAnimes;
  }
  return json;
}

const genreQuery = `
query {
	GenreCollection
}
`;

type GenreQueryResponse = {
  data: {
    GenreCollection: string[];
  };
};

export async function fetchGenres() {
  const query = genreQuery;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  });
  const json: GenreQueryResponse = await response.json();
  return json.data.GenreCollection.filter((genre) => genre !== "Hentai");
}

const MyAnimeQuery = `
fragment media on Media {
  id
  title {
    userPreferred
    romaji
    english
    native
  }
  coverImage {
    extraLarge
  }
  episodes
  streamingEpisodes {
    title
  }
  nextAiringEpisode {
    id
    airingAt
    episode
  }
  season
  seasonYear
}

query ($ids: [Int]) {
  Page(page: 1, perPage: PER_PAGE) {
    media(id_in: $ids, type:ANIME) {
      ...media
    }
  }
}
`;

export async function fetchMyAnimeList(ids: number[], PER_PAGE: number) {
  const query = MyAnimeQuery.replace("PER_PAGE", PER_PAGE.toString());
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { ids, PER_PAGE },
    }),
  });
  const json = await response.json();
  return json;
}

type LikedAnime = {
  anime_id: number;
  finished: boolean;
  episode: number | null;
  id: number;
  user_id: string;
  created_at: Date;
};
import { Anime, AnimeData } from "./anime-types";

export async function getLikedAnimesList(
  likedAnimesList: LikedAnime[],
  PER_PAGE: number
) {
  let likedAnimes = [];
  let ids = [];
  for (let i = 0; i < likedAnimesList.length; i++) {
    likedAnimes.push({
      id: likedAnimesList[i].anime_id,
      finished: likedAnimesList[i].finished,
      episode: likedAnimesList[i].episode,
      anime: {} as Anime,
    });
    ids.push(likedAnimesList[i].anime_id);
  }

  const data: AnimeData = await fetchMyAnimeList(ids, PER_PAGE);
  const animes = data.data;
  for (let i = 0; i < likedAnimes.length; i++) {
    likedAnimes[i].anime = animes.Page.media.filter(
      (anime) => anime.id === likedAnimes[i].id
    )[0];
  }
  return likedAnimes;
}

// import { currentUser } from "@clerk/nextjs/server";
// import { and, eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// export async function addToMyList(
//   animeId: number,
//   status: "watching" | "finished",
//   refresh: boolean,
//   formData: FormData
// ) {
//   const user = await currentUser();
//   if (!user) {
//     return;
//   }

//   const alreadyLiked = await db.$count(
//     MyAnimesTable,
//     and(eq(MyAnimesTable.anime_id, animeId), eq(MyAnimesTable.user_id, user.id))
//   );

//   if (alreadyLiked) {
//     return;
//   }

//   let result = await db.insert(MyAnimesTable).values({
//     anime_id: animeId,
//     user_id: user.id,
//     episode: formData.get("episodeNumber")
//       ? parseInt(formData.get("episodeNumber") as string)
//       : null,
//     finished: status === "finished",
//   });

//   if (refresh) {
//     revalidatePath(`/anime/${animeId}`);
//   }
//   return result;
// }

// export async function removefromMyList(animeId: number, refresh: boolean) {
//   const user = await currentUser();
//   if (!user) {
//     return;
//   }

//   let result = await db
//     .delete(MyAnimesTable)
//     .where(
//       and(
//         eq(MyAnimesTable.anime_id, animeId),
//         eq(MyAnimesTable.user_id, user.id)
//       )
//     );

//   if (refresh) {
//     revalidatePath(`/anime/${animeId}`);
//   }

//   return result;
// }

// export async function fetchMyAnimeIds() {
//   const user = await currentUser();
//   if (!user) {
//     return;
//   }
//   const likedAnimes = await db
//     .select({ id: MyAnimesTable.anime_id })
//     .from(MyAnimesTable)
//     .where(eq(MyAnimesTable.user_id, user.id));

//   return likedAnimes.map((anime) => anime.id);
// }
