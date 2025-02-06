export interface AnimeData {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

export interface Anime {
  id: number;
  title: Title;
  coverImage: CoverImage;
  episodes: number;
  streamingEpisodes?: StreamingEpisode[]; // Optional if empty arrays need handling: `streamingEpisodes?: StreamingEpisode[]`
  nextAiringEpisode: NextAiringEpisode | null;
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear: number;
}

export interface Title {
  userPreferred: string;
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
}

export interface StreamingEpisode {
  title: string;
}

export interface NextAiringEpisode {
  id: number;
  airingAt: number;
  episode: number;
}
