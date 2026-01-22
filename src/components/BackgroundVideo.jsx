import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import '../pages/Details.css'; // Reusing existing styles

const BackgroundVideo = forwardRef(({ videoKey, showVideo, isMuted, setIsMuted }, ref) => {
    const iframeRef = useRef(null);

    // Expose toggleMute method to parent
    useImperativeHandle(ref, () => ({
        toggleMute: () => {
            if (iframeRef.current) {
                const command = isMuted ? 'unMute' : 'mute'; // YouTube API command
                iframeRef.current.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: command,
                    args: []
                }), '*');
                setIsMuted(!isMuted);
            }
        }
    }));

    if (!videoKey) return null;

    return (
        <div className={`hero-video-wrapper ${showVideo ? 'visible' : ''}`}>
            <iframe
                ref={iframeRef}
                className="hero-iframe"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`}
                allow="autoplay; encrypted-media"
                title="Trailer"
            ></iframe>
        </div>
    );
});

export default BackgroundVideo;
