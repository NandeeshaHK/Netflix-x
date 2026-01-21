import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import ContentRail from '../components/ContentRail';
import useAuthStore from '../store/useAuthStore';
import { fetchTrending, fetchNowPlaying, fetchPopular, fetchMoviesByGenre } from '../services/tmdb';
import { filterContentForProfile } from '../utils/recommendationEngine';

const Home = () => {
    const { currentProfile } = useAuthStore();
    const [heroContent, setHeroContent] = useState(null);
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topPicks, setTopPicks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const [trendingData, nowPlayingData, popularData] = await Promise.all([
                    fetchTrending(),
                    fetchNowPlaying(),
                    fetchPopular()
                ]);

                // Set Hero Banner (random from trending)
                setHeroContent(trendingData[Math.floor(Math.random() * trendingData.length)]);
                setTrending(trendingData);
                setPopular(popularData);

                // Personalize "Top Picks"
                // Combine all data sources to find best matches
                const allContent = [...trendingData, ...nowPlayingData, ...popularData];
                // Remove duplicates
                const uniqueContent = Array.from(new Set(allContent.map(a => a.id)))
                    .map(id => {
                        return allContent.find(a => a.id === id);
                    });

                const recommendations = filterContentForProfile(uniqueContent, currentProfile);
                setTopPicks(recommendations.slice(0, 20));

            } catch (error) {
                console.error("Failed to load content", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentProfile) {
            loadContent();
        }
    }, [currentProfile]);

    if (!currentProfile) return <div>Redirecting...</div>; // Should be handled by router protection
    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading StreamFlix...</div>;

    return (
        <div style={{ paddingBottom: '50px' }}>
            <Navbar />
            <HeroBanner content={heroContent} />

            <div style={{ marginTop: '-100px', position: 'relative', zIndex: 20 }}>
                <ContentRail title={`Top Picks for ${currentProfile.name}`} content={topPicks} />
                <ContentRail title="Trending Now" content={trending} />
                <ContentRail title="Popular on StreamFlix" content={popular} />

                {/* Add more specific rails based on genres if time permits */}
                {/* Example of simple genre rail logic could go here */}
            </div>
        </div>
    );
};

export default Home;
