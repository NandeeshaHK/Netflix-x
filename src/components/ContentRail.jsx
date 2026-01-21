import React, { useRef, useState, useEffect } from 'react';
import ContentCard from './ContentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ContentRail.css';

const ContentRail = ({ title, content, type = 'poster' }) => {
    const railRef = useRef(null);
    const [showControls, setShowControls] = useState(false);

    // Safety check
    if (!content || content.length === 0) return null;

    const scroll = (direction) => {
        if (railRef.current) {
            const { scrollLeft, clientWidth } = railRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth + 100
                : scrollLeft + clientWidth - 100;

            railRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="rail-container"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <h2 className="rail-title">{title}</h2>

            <div className="rail-wrapper">
                {showControls && (
                    <button className="rail-control left" onClick={() => scroll('left')}>
                        <ChevronLeft size={32} />
                    </button>
                )}

                <div className="rail-scroll" ref={railRef}>
                    {content.map((item) => (
                        <ContentCard key={item.id} content={item} />
                    ))}
                </div>

                {showControls && (
                    <button className="rail-control right" onClick={() => scroll('right')}>
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContentRail;
