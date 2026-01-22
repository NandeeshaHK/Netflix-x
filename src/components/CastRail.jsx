import React, { useState, useEffect } from 'react';
import '../pages/Details.css';

const CastRail = ({ cast, visible }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-swipe logic
    useEffect(() => {
        if (!visible || !cast || cast.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % cast.length);
        }, 3000); // Swipe every 3 seconds

        return () => clearInterval(interval);
    }, [visible, cast]);

    if (!cast || cast.length === 0 || !visible) return null;

    // Get visible stack (active + next 2)
    const getStackStyle = (index) => {
        const offset = (index - activeIndex + cast.length) % cast.length;

        // Only show top 3 cards in the stack visually
        if (offset > 3) return { opacity: 0, pointerEvents: 'none' };

        const scale = 1 - (offset * 0.1);
        const translateX = offset * 25; // Stack shift
        const zIndex = 10 - offset;
        const opacity = 1 - (offset * 0.2); // Fade out back cards

        return {
            transform: `translateX(${translateX}px) scale(${scale})`,
            zIndex: zIndex,
            opacity: opacity,
        };
    };

    return (
        <div className="cast-stack-container">
            <div className="cast-stack-track">
                {cast.map((actor, index) => (
                    <div
                        key={actor.id}
                        className="cast-card-stack"
                        style={getStackStyle(index)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                            alt={actor.name}
                            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=random`}
                            className="stack-img"
                        />
                        <div className="stack-info-gradient">
                            <span className="stack-actor-name">{actor.name}</span>
                            <span className="stack-char-name">{actor.character}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastRail;
