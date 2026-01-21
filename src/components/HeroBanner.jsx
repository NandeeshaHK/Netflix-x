import React, { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVideos } from '../services/tmdb';
import './HeroBanner.css';

const HeroBanner = ({ content }) => {
    const navigate = useNavigate();
    const [trailerKey, setTrailerKey] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        const loadTrailer = async () => {
            if (content) {
                // Reset state
                setTrailerKey(null);
                setShowVideo(false);

                try {
                    const type = content.media_type || 'movie';
                    const videos = await fetchVideos(type, content.id);
                    // Find Youtube Trailer
                    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                        videos.find(v => v.site === 'YouTube' && v.type === 'Teaser');

                    if (trailer) {
                        setTrailerKey(trailer.key);
                        // Delay showing video to allow buffering/loading behind image
                        setTimeout(() => setShowVideo(true), 2000);
                    }
                } catch (e) {
                    console.error("Failed to load trailer", e);
                }
            }
        };
        loadTrailer();
    }, [content]);

    if (!content) return null;

    const imageUrl = `https://image.tmdb.org/t/p/original${content.backdrop_path}`;

    return (
        <div className="hero-banner">
            {/* Background Image (Always there, hidden if video plays perfectly, or used as loading) */}
            <div
                className={`hero-backdrop-img ${showVideo ? 'hidden' : ''}`}
                style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>

            {/* Video Background */}
            {trailerKey && (
                <div className={`hero-video-container ${showVideo ? 'visible' : ''}`}>
                    <iframe
                        className="hero-iframe"
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&start=10`}
                        title="Hero Video"
                        allow="autoplay; encrypted-media"
                        frameBorder="0"
                    ></iframe>
                </div>
            )}

            {/* Gradient Scrim */}
            <div className="hero-overlay"></div>

            <div className="hero-content">
                <h1 className="hero-title">{content.title || content.name}</h1>
                <p className="hero-overview">{content.overview}</p>

                <div className="hero-actions">
                    <button className="hero-btn primary" onClick={() => navigate(`/watch/${content.media_type || 'movie'}/${content.id}`)}>
                        <Play fill="black" size={24} /> Play
                    </button>
                    <button className="hero-btn secondary" onClick={() => navigate(`/watch/${content.media_type || 'movie'}/${content.id}`)}>
                        <Info size={24} /> More Info
                    </button>
                    {/* Mute toggle could go here, but omitted for now as iframe control is limited without API */}
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
