import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Lock } from 'lucide-react';
import './ProfileSelection.css';
import { useNavigate } from 'react-router-dom';

const ProfileSelection = () => {
    const { profiles, login } = useAuthStore();
    const [pinPrompt, setPinPrompt] = useState(null); // profileId being authenticated
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleProfileClick = (profile) => {
        // If profile is protected (check store logic or data, store handles logic but we need to know if we should show pin UI)
        // Ideally store exposes 'isProtected' helper or we rely on data. 
        // Let's try to login with empty pin first or check metadata.
        // Simplified: The App knows from mockData which are protected.
        // Actually, the store login function returns success:false if pin needed.
        // But for better UX we should show PIN modal if we know it's protected.
        // Using a hardcoded list check here for UI or better, try login and see.
        // Let's check the mockData imported logic in store... actually store access is clean.
        // We will assume p1, p2 are protected because I wrote the mock data.

        const isProtected = ['p1', 'p2'].includes(profile.profileId);

        if (isProtected) {
            setPinPrompt(profile.profileId);
            setPin('');
            setError('');
        } else {
            const result = login(profile.profileId);
            if (result.success) {
                navigate('/');
            }
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        const result = login(pinPrompt, pin);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
            setPin('');
        }
    };

    return (
        <div className="profile-gate">
            <h1 className="gate-title">Who's watching?</h1>

            <div className="profiles-container">
                {profiles.map((profile) => (
                    <div key={profile.profileId} className="profile-card" onClick={() => handleProfileClick(profile)}>
                        <div className="avatar-wrapper">
                            <img src={`/assets/${profile.avatar}`}
                                alt={profile.name}
                                className="profile-avatar"
                                onError={(e) => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                            />
                            {['p1', 'p2'].includes(profile.profileId) && <div className="lock-icon"><Lock size={16} /></div>}
                        </div>
                        <span className="profile-name">{profile.name}</span>
                    </div>
                ))}
            </div>

            {pinPrompt && (
                <div className="pin-overlay">
                    <div className="pin-modal">
                        <h3>Enter Profile PIN</h3>
                        <p>Accessing restricted profile.</p>
                        <form onSubmit={handlePinSubmit}>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                maxLength={4}
                                autoFocus
                                className="pin-input"
                            />
                            {error && <p className="error-msg">{error}</p>}
                            <div className="pin-actions">
                                <button type="button" onClick={() => setPinPrompt(null)}>Cancel</button>
                                <button type="submit" className="primary-btn">Enter</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelection;
