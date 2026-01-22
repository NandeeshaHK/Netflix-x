import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { fetchDetails, fetchVideos } from '../services/tmdb';
import CastRail from '../components/CastRail';
import BackgroundVideo from '../components/BackgroundVideo';
import './Details.css';

const Details = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [videoKey, setVideoKey] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [dominantColor, setDominantColor] = useState('#e50914');

    // UI States
    const [showVideo, setShowVideo] = useState(false); // Controls visibility of video layer
    const [uiVisible, setUiVisible] = useState(true); // Controls visibility of text/buttons
    const [showCast, setShowCast] = useState(false); // Cast Stack Toggle

    const iframeRef = useRef(null);
    const idleTimerRef = useRef(null);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const details = await fetchDetails(type, id);
                setContent(details);

                const videos = await fetchVideos(type, id);
                const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") ||
                    videos.find(v => v.site === "YouTube");

                if (trailer) {
                    setVideoKey(trailer.key);
                    // Start transition to video after 2.5 seconds
                    setTimeout(() => {
                        setShowVideo(true);
                    }, 2500);
                }

                // Color extraction
                if (details.genres && details.genres.length > 0) {
                    const genreId = details.genres[0].id;
                    const colors = {
                        28: '#EF4444', 12: '#F59E0B', 16: '#3B82F6', 35: '#EC4899',
                        80: '#1F2937', 99: '#10B981', 18: '#8B5CF6', 10751: '#F472B6',
                        14: '#A855F7', 27: '#DC2626', 878: '#06B6D4', 53: '#4B5563',
                    };
                    if (colors[genreId]) setDominantColor(colors[genreId]);
                }

            } catch (err) {
                console.error("Failed to fetch details", err);
            }
        };
        loadData();
    }, [type, id]);

    // Mute Toggle using PostMessage (No Reload)
    const toggleMute = () => {
        if (iframeRef.current) {
            iframeRef.current.toggleMute();
        }
    };

    // Idle UI Hider
    const resetIdleTimer = useCallback(() => {
        if (!uiVisible) setUiVisible(true);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

        if (showVideo && !isMuted) { // Only hide if video is playing nicely
            idleTimerRef.current = setTimeout(() => {
                setUiVisible(false);
            }, 3000);
        }
    }, [showVideo, isMuted, uiVisible]);

    useEffect(() => {
        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('click', resetIdleTimer);
        return () => {
            window.removeEventListener('mousemove', resetIdleTimer);
            window.removeEventListener('click', resetIdleTimer);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [resetIdleTimer]);


    if (!content) return <div className="details-page"></div>;

    const votePercentage = Math.round(content.vote_average * 10);
    const circumference = 2 * Math.PI * 16;
    const strokeDashoffset = circumference - (votePercentage / 100) * circumference;

    const handlePlay = () => {
        navigate(`/watch/${type}/${id}`);
    };

    // Cast Logic
    const cast = content.credits?.cast?.slice(0, 10) || [];

    return (
        <div className="details-page">
            <button className={`back-btn ${!uiVisible ? 'hidden' : ''}`} onClick={() => navigate(-1)} aria-label="Go back">
                <ArrowLeft size={24} />
            </button>

            <div className="details-hero">
                <BackgroundVideo
                    ref={iframeRef}
                    videoKey={videoKey}
                    showVideo={showVideo}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                />

                {/* Backdrop Image - Fades out when video shows */}
                <div className={`hero-backdrop ${showVideo ? 'fade-out' : ''}`} style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${content.backdrop_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}></div>

                <div className="hero-overlay"></div>

                <div className={`details-content ${!uiVisible ? 'hidden' : ''}`}>
                    <h1 className="movie-title">{content.title || content.name}</h1>

                    <div className="meta-data">
                        <span className="rating-container">
                            <div className="rating-circle">
                                <svg width="40" height="40" className="rating-svg">
                                    <circle cx="20" cy="20" r="16" className="rating-bg" />
                                    <circle
                                        cx="20" cy="20" r="16"
                                        className="rating-progress"
                                        style={{
                                            strokeDasharray: circumference,
                                            strokeDashoffset: strokeDashoffset,
                                            stroke: dominantColor
                                        }}
                                    />
                                </svg>
                                <span style={{ position: 'absolute', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    {votePercentage}
                                </span>
                            </div>
                        </span>
                        <span className="match-score">{votePercentage}% Match</span>
                        <span>{content.release_date?.substring(0, 4) || content.first_air_date?.substring(0, 4)}</span>
                        <span className="quality-badge">HD</span>
                    </div>

                    <p className="overview">{content.overview}</p>

                    <div className="action-buttons-row">
                        <div className="main-actions">
                            <button
                                className="btn-primary"
                                style={{ backgroundColor: dominantColor, color: 'white' }}
                                onClick={handlePlay}
                            >
                                <Play fill="white" size={24} /> Play
                            </button>
                            <button className="btn-secondary">More Info</button>
                            <button className="btn-round" title="Add to My List"><Plus /></button>
                            <button className="btn-round" title="Like"><ThumbsUp /></button>
                        </div>

                        <button
                            className={`btn-cast-toggle ${showCast ? 'active' : ''}`}
                            onClick={() => setShowCast(!showCast)}
                            title="Toggle Cast"
                        >
                            <div className="avatars-preview">
                                {cast.slice(0, 3).map(c => (
                                    <img key={c.id} src={`https://image.tmdb.org/t/p/w200${c.profile_path}`} alt="" />
                                ))}
                            </div>
                            <span>Cast & Crew</span>
                        </button>
                    </div>

                    <CastRail cast={cast} visible={showCast} />
                </div>

                {videoKey && showVideo && (
                    <button className={`sound-btn ${!uiVisible ? 'hidden' : ''}`} onClick={toggleMute}>
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Details;
