/**
 * Mock Data for StreamFlix
 * Includes Profiles, Watch History, and Preferences
 */

export const mockProfiles = [
  {
    profileId: "p1",
    name: "Father",
    avatar: "avatar_male_1.png", // We will need to map these to actual assets or URLs
    ageGroup: "45+",
    preferences: {
      genres: ["Drama", "Crime", "History", "War"],
      languages: ["en", "hi"],
      contentType: ["movie", "tv"],
    },
    watchHistory: [
      { tmdbId: 238, type: "movie", progress: 100 }, // The Godfather
      { tmdbId: 1399, type: "tv", progress: 80 },    // Game of Thrones
    ],
    watchList: [155, 680, 1396],
    recommendationStrategy: "genre_weighted + watch_history",
  },
  {
    profileId: "p2",
    name: "Mother",
    avatar: "avatar_female_1.png",
    ageGroup: "35–45",
    preferences: {
      genres: ["Romance", "Drama", "Family"],
      languages: ["en", "hi", "ta"],
      contentType: ["movie"],
    },
    watchHistory: [
      { tmdbId: 597, type: "movie", progress: 100 }, // Titanic
    ],
    watchList: [13, 210577],
    recommendationStrategy: "genre + popularity",
  },
  {
    profileId: "p3",
    name: "Teen",
    avatar: "avatar_teen.png",
    ageGroup: "13–18",
    preferences: {
      genres: ["Action", "Sci-Fi", "Fantasy", "Anime"],
      languages: ["en", "ja"],
      contentType: ["movie", "tv"],
    },
    watchHistory: [
      { tmdbId: 299534, type: "movie", progress: 100 }, // Avengers: Endgame
    ],
    watchList: [634649, 872585],
    recommendationStrategy: "trending + similar_titles",
  },
  {
    profileId: "p4",
    name: "Kids",
    avatar: "avatar_kids.png",
    ageGroup: "5–10",
    preferences: {
      genres: ["Animation", "Adventure", "Comedy"],
      languages: ["en"],
      contentType: ["movie", "tv"],
      contentRating: ["G", "PG"],
    },
    watchHistory: [
      { tmdbId: 862, type: "movie", progress: 100 }, // Toy Story
    ],
    watchList: [508947, 129],
    recommendationStrategy: "family_safe_only",
  },
];

export const mockAuth = {
  profileSelection: true,
  pinProtectedProfiles: ["p1", "p2"],
  pin: "1234", // Simple mock pin for all protected profiles
};

export const appConfig = {
  name: "StreamFlix",
  theme: {
    mode: "dark",
    primaryColor: "#E50914",
    background: "#141414",
    font: "Netflix Sans",
  },
};
