import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TMDB_GENRES } from '../services/tmdb';
import './ContentCard.css';

const ContentCard = ({ content }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    if (!content || (!content.poster_path && !content.backdrop_path)) return null;

    const imageUrl = `https://image.tmdb.org/t/p/w500${content.backdrop_path || content.poster_path}`;

    const handlePlay = (e) => {
        e.stopPropagation();
        navigate(`/watch/${content.media_type || 'movie'}/${content.id}`);
    };

    const handleDetails = () => {
        navigate(`/title/${content.media_type || 'movie'}/${content.id}`);
    };

    // Genre mapping lookup
    const genreNames = (content.genre_ids || []).slice(0, 3).map(id => TMDB_GENRES[id]).filter(Boolean);

    // Mock match score randomly between 85 and 99 if not present
    // Ideally passed from parent who calculates it. Let's assume passed or calc here.
    const matchScore = content.vote_average ? Math.round(content.vote_average * 10) : 90;

    return (
        <div
            className="content-card-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleDetails}
        >
            <div className="content-card">
                <img
                    src={imageUrl}
                    alt={content.title || content.name}
                    className="card-img"
                    onError={(e) => e.target.style.display = 'none'}
                />
            </div>

            {isHovered && (
                <div className="content-card-hover">
                    <div className="hover-media-container">
                        <img src={imageUrl} alt={content.title || content.name} className="card-img-hover" />
                        <div className="hover-overlay-gradient"></div>
                    </div>

                    <div className="card-info">
                        <div className="card-actions">
                            <div className="left-actions">
                                <button className="icon-btn-filled" onClick={handlePlay}><Play size={16} fill="black" /></button>
                                <button className="icon-btn"><Plus size={16} /></button>
                                <button className="icon-btn"><ThumbsUp size={16} /></button>
                            </div>
                            <button className="icon-btn ml-auto"><ChevronDown size={16} /></button>
                        </div>

                        <div className="card-meta">
                            <span className="match-score">{matchScore}% Match</span>
                            <span className="maturity-rating">{content.adult ? '18+' : '12+'}</span>
                            <span className="duration">2h 15m</span> {/* Mocked duration */}
                            <span className="quality-badge">HD</span>
                        </div>

                        <div className="card-genres">
                            {genreNames.map((genre, index) => (
                                <React.Fragment key={genre}>
                                    <span>{genre}</span>
                                    {index < genreNames.length - 1 && <span className="separator">&bull;</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentCard;
