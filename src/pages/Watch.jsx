import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Watch = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white', position: 'relative' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', zIndex: 10 }}
            >
                <ArrowLeft /> Back to Browse
            </button>

            <h1 style={{ marginBottom: '2rem' }}>Now Playing: {type.toUpperCase()} ID {id}</h1>

            <div style={{ width: '80%', height: '60%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #333' }}>
                <p>Video Player Placeholder</p>
            </div>
        </div>
    );
};

export default Watch;
