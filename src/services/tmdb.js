import axios from 'axios';

const TMDB_API_KEY = "c2693a87b633a7f1869d8fd7d1e6a765";
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
    },
});

export const fetchTrending = async (timeWindow = 'day') => {
    const response = await tmdbClient.get(`/trending/all/${timeWindow}`);
    return response.data.results;
};

export const fetchNowPlaying = async () => {
    const response = await tmdbClient.get(`/movie/now_playing`);
    return response.data.results;
};

export const fetchPopular = async () => {
    const response = await tmdbClient.get(`/movie/popular`);
    return response.data.results;
};

export const fetchMoviesByGenre = async (genreId) => {
    const response = await tmdbClient.get(`/discover/movie`, {
        params: {
            with_genres: genreId
        }
    });
    return response.data.results;
};

export const searchContent = async (query) => {
    if (!query) return [];
    const response = await tmdbClient.get(`/search/multi`, {
        params: { query },
    });
    return response.data.results;
};

export const fetchDetails = async (type, id) => {
    const response = await tmdbClient.get(`/${type}/${id}`, {
        params: {
            append_to_response: "credits,videos,recommendations,similar",
        },
    });
    return response.data;
};

export const fetchVideos = async (type, id) => {
    const response = await tmdbClient.get(`/${type}/${id}/videos`);
    return response.data.results;
};

// Genre mapping helper could go here or in utils
export const TMDB_GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

export default tmdbClient;
