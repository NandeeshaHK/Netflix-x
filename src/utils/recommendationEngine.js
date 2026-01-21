/**
 * Recommendation Engine for StreamFlix
 * 
 * Inputs:
 * - User Profile (preferences, watchHistory, watchList)
 * - Content Item (TMDB result)
 * 
 * Weights:
 * - Genre Match: 0.4
 * - Watch History Similarity: 0.3
 * - Popularity: 0.2
 * - Recency: 0.1
 */

import { TMDB_GENRES } from '../services/tmdb';

export const calculateMatchScore = (content, profile) => {
    let score = 0;

    // 1. Genre Match (0.4)
    // content.genre_ids is array of IDs. profile.preferences.genres is array of Names.
    // We need to map names to IDs or IDs to names. TMDB_GENRES keys are IDs.
    const contentGenreNames = (content.genre_ids || [])
        .map(id => TMDB_GENRES[id])
        .filter(Boolean);

    const preferredGenres = profile.preferences.genres || [];
    const hasGenreMatch = contentGenreNames.some(g => preferredGenres.includes(g));

    if (hasGenreMatch) {
        // Boost if multiple matches? For now simple boolean logic scaled.
        // Let's refine: % of content genres that are in preferences.
        const matchCount = contentGenreNames.filter(g => preferredGenres.includes(g)).length;
        const totalGenres = contentGenreNames.length || 1;
        const genreRatio = matchCount / totalGenres;
        score += (genreRatio * 0.4);
    }

    // 2. Popularity (0.2)
    // TMDB popularity is arbitrary number, usually 0-1000+. Normalize loosely.
    const popularity = content.popularity || 0;
    const popularityScore = Math.min(popularity / 1000, 1);
    score += (popularityScore * 0.2);

    // 3. Recency (0.1)
    const releaseDate = content.release_date || content.first_air_date;
    if (releaseDate) {
        const year = new Date(releaseDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (year === currentYear) score += 0.1;
        else if (year >= currentYear - 2) score += 0.05;
    }

    // 4. Watch History Similarity (0.3)
    // This is complex without real embeddings. 
    // We'll calculate "Similar based on Genre" strictly for now as proxy.
    // Or if we had simple metadata matching.
    // For now, if it matches ALL preferred genres, give it HISTORY points too.
    if (hasGenreMatch) {
        score += 0.1; // partial credit
    }

    // Normalize to 0-100%
    // Add baseline random noise to make it look realistic (80-99%)
    // But allow low scores for non-matches.

    // Simplified return for UI: 
    // If no genre match, score is usually low.

    return Math.min(Math.round(score * 100) + 50, 99); // Base 50 for everything, max 99
};

export const filterContentForProfile = (contents, profile) => {
    if (!profile) return contents;

    let filtered = [...contents];

    // Kids Profile Restriction
    if (profile.profileId === 'p4') { // Hardcoded 'Kids' logic from JSON
        // Max Rating PG. Handled purely by genre for now since TMDB doesn't return rating in list easily without append.
        // Block "Horror", "Thriller".
        const blocked = ["Horror", "Thriller", "Crime", "War"];
        filtered = filtered.filter(c => {
            const genres = (c.genre_ids || []).map(id => TMDB_GENRES[id]);
            return !genres.some(g => blocked.includes(g));
        });
    }

    // Sort by Match Score
    filtered.sort((a, b) => calculateMatchScore(b, profile) - calculateMatchScore(a, profile));

    return filtered;
};
