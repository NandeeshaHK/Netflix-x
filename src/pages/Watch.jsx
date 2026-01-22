import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { fetchVideos } from '../services/tmdb';

const Watch = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [videoKey, setVideoKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getVideo = async () => {
            try {
                const videos = await fetchVideos(type, id);
                // Priority: Trailer > Teaser > Any YouTube video
                let video = videos.find(v => v.site === "YouTube" && v.type === "Trailer");
                if (!video) video = videos.find(v => v.site === "YouTube" && v.type === "Teaser");
                if (!video) video = videos.find(v => v.site === "YouTube");

                if (video) {
                    setVideoKey(video.key);
                }
            } catch (error) {
                console.error("Failed to fetch video", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getVideo();
        }
    }, [type, id]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white', position: 'relative' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', zIndex: 10, padding: '10px 20px', borderRadius: '4px' }}
            >
                <ArrowLeft /> Back
            </button>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Loader className="animate-spin" size={48} />
                    <p>Loading trailer...</p>
                </div>
            ) : videoKey ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0&rel=0`}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ border: 'none' }}
                ></iframe>
            ) : (
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '20px' }}>
                    <h2 style={{ marginBottom: '10px', fontSize: '2rem' }}>No Trailer Available</h2>
                    <p style={{ color: '#aaa' }}>We couldn't find a trailer for this content.</p>
                </div>
            )}
        </div>
    );
};

export default Watch;
